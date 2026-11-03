"""
Builds a realistic blue-hour Pune valley in Blender and renders the images the
site shows. Nothing is downloaded: terrain, city, trees, river and landmarks are
all generated here (seeded, so every run gives the same scene).

    blender -b --factory-startup --python blender/render_scene.py -- [--preview] [--only hero|stops] [--mode day|night]

Writes to public/renders/:
    <mode>/hero/0000.webp …           camera fly-in, scrubbed by scroll
    <mode>/stops/0.webp …             one still per journey stop (mode = day | night)
    labels.json                       where each landmark label sits in every image
"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Matrix, Vector, noise

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = "--preview" in ARGS
ONLY = ARGS[ARGS.index("--only") + 1] if "--only" in ARGS else None
MODES = [ARGS[ARGS.index("--mode") + 1]] if "--mode" in ARGS else ["day", "night"]
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "renders")
HERO_FRAMES = 6 if PREVIEW else 44
RES = (800, 450) if PREVIEW else (1440, 810)

random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


# ── Materials ─────────────────────────────────────────────────
def principled(name, color, rough=0.8, metal=0.0, emit=None, strength=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


def mix_rgb(nt, fac, a, b):
    n = nt.nodes.new("ShaderNodeMix")
    n.data_type = "RGBA"
    nt.links.new(fac, n.inputs[0])
    for sock, val in ((n.inputs[6], a), (n.inputs[7], b)):
        if isinstance(val, tuple):
            sock.default_value = (*val, 1)
        else:
            nt.links.new(val, sock)
    return n.outputs[2]


def terrain_material():
    # Dry grass in the valley, darker scrub on the hills, rock on steep slopes.
    m = bpy.data.materials.new("terrain")
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(geo.outputs["Normal"], sep.inputs[0])
    steep = nt.nodes.new("ShaderNodeMapRange")
    steep.inputs["From Min"].default_value = 0.92
    steep.inputs["From Max"].default_value = 0.75
    nt.links.new(sep.outputs["Z"], steep.inputs["Value"])
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 0.08
    nz.inputs["Detail"].default_value = 8
    coord = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(coord.outputs["Object"], nz.inputs["Vector"])
    grass = mix_rgb(nt, nz.outputs["Fac"], srgb("#7D7A5C"), srgb("#9A916E"))
    ground = mix_rgb(nt, steep.outputs["Result"], grass, srgb("#8A7D6C"))
    nt.links.new(ground, b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.95
    return m


def facade_images():
    """Facade colour (white wall × plaster tint, soft glass) and two window-emission maps: day and night."""
    W = 256
    col = bpy.data.images.new("facade_color", W, W)
    emi = bpy.data.images.new("facade_emit_day", W, W)
    emn = bpy.data.images.new("facade_emit_night", W, W)
    c = [1.0, 1.0, 1.0, 1.0] * (W * W)
    e = [0.0, 0.0, 0.0, 1.0] * (W * W)
    en = [0.0, 0.0, 0.0, 1.0] * (W * W)
    cell = 32
    for gy in range(1, W // cell):
        for gx in range(W // cell):
            roll = random.random()
            lit, lit_night = roll < 0.04, roll < 0.26
            warm = random.choice([(1.0, 0.68, 0.36), (1.0, 0.8, 0.55), (0.85, 0.9, 1.0)])
            for y in range(gy * cell + 11, gy * cell + 22):
                for x in range(gx * cell + 10, gx * cell + 22):
                    i = (y * W + x) * 4
                    c[i:i + 4] = (0.56, 0.6, 0.66, 1)  # soft glass, not black holes
                    if lit:
                        e[i:i + 4] = (*warm, 1)
                    if lit_night:
                        en[i:i + 4] = (*warm, 1)
            for x in range(gx * cell + 6, gx * cell + 26):  # sill
                i = ((gy * cell + 8) * W + x) * 4
                c[i:i + 4] = (0.7, 0.7, 0.7, 1)
    col.pixels = c
    emi.pixels = e
    emn.pixels = en
    for im in (col, emi, emn):
        im.pack()
    return col, emi, emn


FACADE = {}


def building_material():
    col, emi, emn = facade_images()
    m = bpy.data.materials.new("building")
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexImage")
    tc.image = col
    te = nt.nodes.new("ShaderNodeTexImage")
    te.image = emi
    tint = nt.nodes.new("ShaderNodeAttribute")
    tint.attribute_name = "tint"
    mul = nt.nodes.new("ShaderNodeVectorMath")
    mul.operation = "MULTIPLY"
    nt.links.new(tc.outputs["Color"], mul.inputs[0])
    nt.links.new(tint.outputs["Color"], mul.inputs[1])
    nt.links.new(mul.outputs["Vector"], b.inputs["Base Color"])
    nt.links.new(te.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 0.6
    b.inputs["Roughness"].default_value = 0.9
    FACADE.update(node=te, bsdf=b, day=emi, night=emn)
    return m


M = {
    "terrain": terrain_material(),
    "building": building_material(),
    "water": principled("water", srgb("#3E5566"), 0.05, coat=1.0),
    "road": principled("road", srgb("#6E6A66"), 0.9),
    "marble": principled("marble", srgb("#E9E4DA"), 0.35),
    "stone": principled("stone", srgb("#BDB2A0"), 0.7),
    "glass": principled("glass", srgb("#5A6B80"), 0.12, metal=0.35),
    "mullion": principled("mullion", srgb("#8E959E"), 0.4, metal=0.8),
    "warm": principled("warm", srgb("#F3E3C8"), 0.6, emit=srgb("#FFC27A"), strength=0.6),
    "leaf": principled("leaf", srgb("#4C5E3A"), 0.9),
    "trunk": principled("trunk", srgb("#3B2E24"), 0.9),
    "greenhouse": principled("greenhouse", srgb("#CFE3E8"), 0.05, metal=0.1),
    "plants": principled("plants", srgb("#3F6B35"), 0.8),
    "c_red": principled("c_red", srgb("#8E3A2E"), 0.6, metal=0.3),
    "c_blue": principled("c_blue", srgb("#2E4A6B"), 0.6, metal=0.3),
    "c_ochre": principled("c_ochre", srgb("#A7812F"), 0.6, metal=0.3),
    "c_grey": principled("c_grey", srgb("#6D7378"), 0.6, metal=0.3),
    "roofsheet": principled("roofsheet", srgb("#7C8187"), 0.5, metal=0.7),
}


def add(name, bm, mats, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    return ob


# ── Terrain ───────────────────────────────────────────────────
def ground_height(x, y):
    r = math.hypot(x * 0.9, y)
    rim = max(0.0, (r - 50) / 60)
    rim = rim * rim * (3 - 2 * rim) if rim < 1 else 1.0
    n, amp, freq = 0.0, 1.0, 0.02
    for _ in range(5):
        n += amp * noise.noise(Vector((x * freq, y * freq, 1.7)))
        amp *= 0.5
        freq *= 2.05
    return max(rim * (20 + 18 * n), 0) + 0.3 * noise.noise(Vector((x * 0.05, y * 0.05, 4.2)))


bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=200, y_segments=200, size=230)
for v in bm.verts:
    v.co.z = ground_height(v.co.x, v.co.y)
add("terrain", bm, [M["terrain"]], smooth=True)


# Distant plain beyond the hills, slightly below the rim.
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=3000, matrix=Matrix.Translation((0, 0, 6)))
add("plain", bm, [M["terrain"]])

# ── River ─────────────────────────────────────────────────────
def river_y(x):
    return -4 + 9 * math.sin(x * 0.045) + 3 * math.sin(x * 0.11 + 1)


bm = bmesh.new()
prev = None
for i in range(161):
    x = -160 + i * 2
    y = river_y(x)
    a, b = bm.verts.new((x, y - 3.2, 0.15)), bm.verts.new((x, y + 3.2, 0.15))
    if prev:
        bm.faces.new((prev[0], prev[1], b, a))
    prev = (a, b)
add("river", bm, [M["water"]])

# ── Landmarks' positions (match src/content.js journey order) ──
MARKS = [(-22, 14), (-34, -14), (-10, -24), (14, -20), (26, 2), (8, 22), (34, 36)]


def near_mark(x, y, r):
    return any(math.hypot(x - mx, y - my) < r for mx, my in MARKS)


# ── Roads ─────────────────────────────────────────────────────
bm = bmesh.new()
for k in range(-4, 5):
    for horizontal in (True, False):
        c = k * 11 + random.uniform(-2, 2)
        a0 = -48
        for s in range(48):
            a = a0 + s * 2
            x0, y0 = (a, c) if horizontal else (c, a)
            x1, y1 = (a + 2, c) if horizontal else (c, a + 2)
            if math.hypot(x0 * 0.9, y0) > 48:
                continue
            w = 0.9
            off = Vector((0, w, 0)) if horizontal else Vector((w, 0, 0))
            p0, p1 = Vector((x0, y0, ground_height(x0, y0) + 0.06)), Vector((x1, y1, ground_height(x1, y1) + 0.06))
            bm.faces.new((bm.verts.new(p0 - off), bm.verts.new(p1 - off), bm.verts.new(p1 + off), bm.verts.new(p0 + off)))
add("roads", bm, [M["road"]])


# ── City ──────────────────────────────────────────────────────
PALETTE = [srgb(h) for h in ("#E6DCCB", "#D9CDB8", "#EDE6DA", "#CFC3B0", "#E4CFC2", "#D8D2C4", "#BFB8AC", "#E8D9B5")]


def box(bm, cx, cy, w, d, h, z0, tint=None, tile=25.6):  # 8 windows per 25.6 m = one per 3.2 m storey
    res = bmesh.ops.create_cube(bm, size=1.0)
    vs = res["verts"]
    for v in vs:
        v.co.x, v.co.y, v.co.z = cx + v.co.x * w, cy + v.co.y * d, z0 + (v.co.z + 0.5) * h
    uv = bm.loops.layers.uv.verify()
    tl = bm.loops.layers.float_color.get("tint") or bm.loops.layers.float_color.new("tint")
    faces = {f for v in vs for f in v.link_faces}
    t = tint or random.choice(PALETTE)
    # A building is narrower than one texture repeat, so start each wall on a random
    # window column; otherwise every building samples the same few windows.
    shift = {face_axis: random.randrange(8) / 8 for face_axis in ("x", "y")}
    for f in faces:
        n = f.normal
        for loop in f.loops:
            p = loop.vert.co
            loop[tl] = (*t, 1)
            if abs(n.z) > 0.5:
                loop[uv].uv = (0.02, 0.02)
            elif abs(n.x) > 0.5:
                loop[uv].uv = ((p.y - cy) / tile + shift["x"], (p.z - z0) / tile + 0.125 - 0.02)
            else:
                loop[uv].uv = ((p.x - cx) / tile + shift["y"], (p.z - z0) / tile + 0.125)


bm = bmesh.new()
placed = 0
while placed < 520:
    x, y = random.uniform(-48, 48), random.uniform(-44, 44)
    if math.hypot(x * 0.9, y) > 47 or abs(y - river_y(x)) < 6 or near_mark(x, y, 15):
        continue
    if any(abs(x - (k * 11)) < 1.4 or abs(y - (k * 11)) < 1.4 for k in range(-4, 5)):
        continue
    centre = 1 - min(1, math.hypot(x, y) / 47)
    h = random.uniform(6.5, 13) + (random.uniform(4, 12) * centre if random.random() < 0.12 else 0)
    w, d = random.uniform(2.4, 4.4), random.uniform(2.4, 4.4)
    box(bm, x, y, w, d, h, ground_height(x, y) - 0.3)
    if h < 8 and random.random() < 0.35:  # water tank on the roof, a very Pune detail
        box(bm, x + w * 0.2, y, 0.9, 0.9, 0.8, ground_height(x, y) - 0.3 + h, tint=srgb("#2E2E30"))
    placed += 1
add("city", bm, [M["building"]])

# ── Trees on the hills and between blocks ─────────────────────
# One tree is modelled once (three soft crown lobes + a trunk) and its vertices are
# stamped into place for every tree. Calling a bmesh operator per tree instead gets
# slower as the mesh grows and stalls the build for many minutes.
def template(build):
    t = bmesh.new()
    build(t)
    verts = [v.co.copy() for v in t.verts]
    faces = [[v.index for v in f.verts] for f in t.faces]
    t.free()
    return verts, faces


CROWN = template(lambda t: [
    bmesh.ops.create_uvsphere(t, u_segments=10, v_segments=6, radius=1.0,
                              matrix=Matrix.Translation((ox, oy, oz)) @ Matrix.Diagonal((rr, rr, rr * 0.85, 1)))
    for ox, oy, oz, rr in ((0, 0, 1.5, 1.2), (0.5, 0.3, 2.1, 0.85), (-0.45, -0.25, 1.9, 0.9))
])
TRUNK = template(lambda t: bmesh.ops.create_cone(t, cap_ends=False, segments=5, radius1=0.16, radius2=0.1, depth=1.4,
                                                 matrix=Matrix.Translation((0, 0, 0.6))))
stamped = {"crown": ([], []), "trunk": ([], [])}


def stamp(kind, tpl, x, y, z, s):
    verts, faces = stamped[kind]
    base = len(verts)
    verts.extend((x + v.x * s, y + v.y * s, z + v.z * s) for v in tpl[0])
    faces.extend([i + base for i in f] for f in tpl[1])


for _ in range(2600):
    x, y = random.uniform(-200, 200), random.uniform(-200, 200)
    r = math.hypot(x * 0.9, y)
    z = ground_height(x, y)
    forest = noise.noise(Vector((x * 0.03, y * 0.03, 9.0)))
    if r < 47 and random.random() > 0.08:
        continue
    if r >= 47 and (forest < -0.05 or z > 34):
        continue
    if near_mark(x, y, 6) or abs(y - river_y(x)) < 4:
        continue
    s = random.uniform(0.8, 1.6)
    stamp("crown", CROWN, x, y, z, s)
    stamp("trunk", TRUNK, x, y, z, s)

for kind, mat, smooth in (("crown", "leaf", True), ("trunk", "trunk", False)):
    me = bpy.data.meshes.new(f"tree_{kind}s")
    me.from_pydata(*[stamped[kind][0], [], stamped[kind][1]])
    me.materials.append(M[mat])
    me.polygons.foreach_set("use_smooth", [smooth] * len(me.polygons))
    me.update()
    scene.collection.objects.link(bpy.data.objects.new(f"tree_{kind}s", me))


def at(i):
    x, y = MARKS[i]
    return x, y, ground_height(x, y)


T = Matrix.Translation

# 0 · MIT-WPU: a campus around a great dome.
x, y, z = at(0)
bm = bmesh.new()
for dx, dy, w, d, h in [(-9, -5, 7, 3.5, 6), (9, -5, 7, 3.5, 6), (-9, 6, 3.5, 8, 5), (9, 6, 3.5, 8, 5)]:
    box(bm, x + dx, y + dy, w, d, h, z - 0.3, tint=srgb("#E3D7C2"))
add("campus", bm, [M["building"]])
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=64, radius1=5.4, radius2=5.4, depth=3.4, matrix=T((x, y, z + 1.7)))
for i in range(16):  # pilasters
    a = i / 16 * math.tau
    bmesh.ops.create_cube(bm, size=1, matrix=T((x + math.cos(a) * 5.45, y + math.sin(a) * 5.45, z + 1.7)) @ Matrix.Diagonal((0.35, 0.35, 3.4, 1)))
add("dome_drum", bm, [M["stone"]], smooth=False)
bm = bmesh.new()
bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=32, radius=5.2, matrix=T((x, y, z + 3.4)))
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < z + 3.35], context="VERTS")
add("dome", bm, [M["marble"]], smooth=True)
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=0.3, radius2=0.02, depth=2.2, matrix=T((x, y, z + 9.6)))
add("dome_finial", bm, [M["mullion"]])

# 1 · Side projects: a hostel block.
x, y, z = at(1)
bm = bmesh.new()
for i in range(3):
    box(bm, x - 5 + i * 5, y + (i % 2) * 1.2, 4.2, 4, 9 + i * 1.5, z - 0.3, tint=srgb("#D9C9AE"))
add("hostel", bm, [M["building"]])

# 2 · Research Copilot: a library with a colonnade.
x, y, z = at(2)
bm = bmesh.new()
box(bm, x, y, 13, 7, 0.9, z - 0.3)
box(bm, x, y, 12, 6.4, 0.7, z + 5.6)
bmesh.ops.create_cone(bm, cap_ends=True, segments=4, radius1=6.8, radius2=0.1, depth=1.6, matrix=T((x, y, z + 7.1)) @ Matrix.Diagonal((1, 0.55, 1, 1)) @ Matrix.Rotation(math.pi / 4, 4, "Z"))
for i in range(8):
    bmesh.ops.create_cone(bm, cap_ends=True, segments=16, radius1=0.32, radius2=0.28, depth=4.7, matrix=T((x - 5.25 + i * 1.5, y - 2.7, z + 3.0)))
add("library", bm, [M["stone"]])
bm = bmesh.new()
box(bm, x, y + 0.7, 10, 3.6, 4.7, z + 0.6, tint=(1, 1, 1))
add("library_hall", bm, [M["building"]])

# 3 · Supply Chain Command Center: warehouse with stacked containers.
x, y, z = at(3)
bm = bmesh.new()
box(bm, x - 3, y + 2, 12, 8, 5, z - 0.3, tint=srgb("#B8B4AA"))
add("warehouse", bm, [M["building"]])
bm = bmesh.new()
box(bm, x - 3, y + 2, 12.4, 8.4, 0.25, z + 4.7, tint=(1, 1, 1))
add("warehouse_roof", bm, [M["roofsheet"]])
stacks = {k: bmesh.new() for k in ("c_red", "c_blue", "c_ochre", "c_grey")}
for i in range(4):
    for j in range(2):
        for layer in range(1 + (i + j) % 3):
            box(stacks[random.choice(list(stacks))], x + 6 + j * 2.7, y - 5 + i * 1.35, 2.55, 1.2, 1.25, z - 0.1 + layer * 1.27, tint=(1, 1, 1))
for k, b_ in stacks.items():
    add(f"containers_{k}", b_, [M[k]])

# 4 · AyurGPT: a glass greenhouse.
x, y, z = at(4)
bm = bmesh.new()
bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=16, radius=5, matrix=T((x, y, z)) @ Matrix.Diagonal((1.3, 1, 0.8, 1)))
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < z - 0.05], context="VERTS")
add("greenhouse", bm, [M["greenhouse"]])
bm = bmesh.new()
for i in range(14):
    a = i / 14 * math.tau
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=random.uniform(0.6, 1.0), matrix=T((x + math.cos(a) * 3, y + math.sin(a) * 2.3, z + 0.7)))
add("greenhouse_plants", bm, [M["plants"]])

# 5 · Augmented Transformations: a glass office tower.
x, y, z = at(5)
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1, matrix=T((x, y, z + 12)) @ Matrix.Diagonal((7, 7, 24, 1)))
bmesh.ops.create_cube(bm, size=1, matrix=T((x + 6, y + 1.5, z + 7)) @ Matrix.Diagonal((5.5, 6, 14, 1)))
add("office_glass", bm, [M["glass"]])
bm = bmesh.new()
for k in range(1, 8):
    bmesh.ops.create_cube(bm, size=1, matrix=T((x, y, z + k * 3.2)) @ Matrix.Diagonal((7.15, 7.15, 0.22, 1)))
for k in range(1, 5):
    bmesh.ops.create_cube(bm, size=1, matrix=T((x + 6, y + 1.5, z + k * 3.2)) @ Matrix.Diagonal((5.65, 6.15, 0.22, 1)))
add("office_floors", bm, [M["mullion"]])
bm = bmesh.new()
for k in (2, 3, 5):
    bmesh.ops.create_cube(bm, size=1, matrix=T((x, y, z + k * 3.2 + 1.5)) @ Matrix.Diagonal((6.9, 6.9, 2.4, 1)))
add("office_lit_floors", bm, [M["warm"]])

# 6 · Next stop: a road out of the valley to a stone gateway.
x, y, z = at(6)
bm = bmesh.new()
for dx in (-2.4, 2.4):
    bmesh.ops.create_cube(bm, size=1, matrix=T((x + dx, y, z + 3)) @ Matrix.Diagonal((0.9, 0.9, 6, 1)))
bmesh.ops.create_cube(bm, size=1, matrix=T((x, y, z + 6.3)) @ Matrix.Diagonal((6, 1.1, 0.8, 1)))
add("gate", bm, [M["stone"]])
bm = bmesh.new()
bmesh.ops.create_icosphere(bm, subdivisions=2, radius=0.25, matrix=T((x, y - 0.7, z + 5.6)))
add("gate_lamp", bm, [M["warm"]])

# ── World: low golden-hour sky ────────────────────────────────
world = bpy.data.worlds.new("blue_hour")
scene.world = world
world.use_nodes = True
wn = world.node_tree
bg = wn.nodes["Background"]
sky = wn.nodes.new("ShaderNodeTexSky")
types = [i.identifier for i in sky.bl_rna.properties["sky_type"].enum_items]
sky.sky_type = next((t for t in types if "NISHITA" in t or "MULTIPLE" in t), types[0])
for prop, val in (("sun_elevation", math.radians(9)), ("sun_rotation", math.radians(250)), ("air_density", 1.4), ("dust_density", 2.5)):
    if hasattr(sky, prop):
        setattr(sky, prop, val)
wn.links.new(sky.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.4
# Night sky: deep indigo overhead, a faint glow on the horizon.
texco = wn.nodes.new("ShaderNodeTexCoord")
sepz = wn.nodes.new("ShaderNodeSeparateXYZ")
ramp = wn.nodes.new("ShaderNodeValToRGB")
wn.links.new(texco.outputs["Generated"], sepz.inputs[0])
wn.links.new(sepz.outputs["Z"], ramp.inputs["Fac"])
ramp.color_ramp.elements[0].position = 0.5
ramp.color_ramp.elements[0].color = (*srgb("#2A2C4E"), 1)
ramp.color_ramp.elements[1].position = 0.62
ramp.color_ramp.elements[1].color = (*srgb("#070A1A"), 1)

# Last light of the day: a weak, warm sun just above the hills behind the city.
sun = bpy.data.lights.new("dusk", "SUN")
sun.energy = 4.6
sun.color = srgb("#FFB98A")
sun.angle = math.radians(3)
sun_ob = bpy.data.objects.new("dusk", sun)
sun_ob.rotation_euler = (math.radians(79), 0, math.radians(250))
scene.collection.objects.link(sun_ob)
fill = bpy.data.lights.new("sky_fill", "SUN")
fill.energy = 0.25
fill.color = srgb("#9FB4FF")
fill_ob = bpy.data.objects.new("sky_fill", fill)
fill_ob.rotation_euler = (math.radians(35), 0, math.radians(40))
scene.collection.objects.link(fill_ob)


def set_mode(mode):
    """Day: low golden sun, almost no lit windows. Night: moonlight, a quarter of windows lit."""
    night = mode == "night"
    for l in list(wn.links):
        if l.to_node == bg and l.to_socket.name == "Color":
            wn.links.remove(l)
    wn.links.new((ramp.outputs["Color"] if night else sky.outputs["Color"]), bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 0.9 if night else 0.4
    sun.energy, sun.color = (0.35, srgb("#9DB2FF")) if night else (4.6, srgb("#FFB98A"))
    sun_ob.rotation_euler = (math.radians(55), 0, math.radians(140)) if night else (math.radians(79), 0, math.radians(250))
    fill.energy = 0.0 if night else 0.25
    FACADE["node"].image = FACADE["night" if night else "day"]
    FACADE["bsdf"].inputs["Emission Strength"].default_value = 2.4 if night else 0.6
    M["warm"].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 3.0 if night else 0.6
    scene.view_settings.exposure = 0.5 if night else -0.2

# ── Render settings ───────────────────────────────────────────
engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
scene.render.engine = "BLENDER_EEVEE" if "BLENDER_EEVEE" in engines else "BLENDER_EEVEE_NEXT"
scene.eevee.taa_render_samples = 16 if PREVIEW else 32
for prop, val in (("use_shadows", True), ("use_raytracing", True), ("volumetric_end", 600.0), ("volumetric_tile_size", "8")):
    try:
        setattr(scene.eevee, prop, val)
    except (AttributeError, TypeError):
        pass
scene.render.resolution_x, scene.render.resolution_y = RES
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = "AgX"
try:
    scene.view_settings.look = "AgX - Medium High Contrast"
except TypeError:
    pass
scene.view_settings.exposure = -0.2
fmts = [i.identifier for i in scene.render.image_settings.bl_rna.properties["file_format"].enum_items]
scene.render.image_settings.file_format = "WEBP" if "WEBP" in fmts else "JPEG"
scene.render.image_settings.quality = 80
EXT = ".webp" if scene.render.image_settings.file_format == "WEBP" else ".jpg"

cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 30
cam_data.clip_end = 1500
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam


def aim(eye, look):
    cam.location = eye
    cam.rotation_euler = (Vector(look) - Vector(eye)).to_track_quat("-Z", "Y").to_euler()
    bpy.context.view_layer.update()


def labels():
    """Normalised screen position (x, y from top-left) of each landmark's label point."""
    lifts = [11, 11, 9, 7, 6, 26, 9]
    out = []
    for i, (mx, my) in enumerate(MARKS):
        p = world_to_camera_view(scene, cam, Vector((mx, my, ground_height(mx, my) + lifts[i])))
        out.append([round(p.x, 4), round(1 - p.y, 4)] if p.z > 0 and 0 <= p.x <= 1 and 0 <= p.y <= 1 else None)
    return out


def render(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def catmull(pts, t):
    n = len(pts) - 1
    i = min(int(t * n), n - 1)
    u = t * n - i
    p0, p1, p2, p3 = pts[max(i - 1, 0)], pts[i], pts[i + 1], pts[min(i + 2, n)]
    return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u ** 3)


# Journey views: circle the valley, one framing per landmark.
VIEWS = []
for i, (mx, my) in enumerate(MARKS):
    mz = ground_height(mx, my)
    a = 0.5 + i * 0.62
    d, h = (56, 52) if i == 5 else (40, 44)
    VIEWS.append((Vector((mx + math.sin(a) * d, my - math.cos(a) * d, mz + h)), Vector((mx, my, mz + (8 if i == 5 else 2.5)))))

meta = {"hero": [], "stops": [], "ext": EXT, "size": list(RES), "modes": MODES}
eyes = [Vector(p) for p in ((6, -165, 52), (0, -110, 38), (-10, -66, 30))] + [VIEWS[0][0]]
looks = [Vector(p) for p in ((0, 0, 8), (-6, 0, 5), (-14, 6, 3))] + [VIEWS[0][1]]
for n, mode in enumerate(MODES):
    set_mode(mode)
    first = n == 0  # the camera is the same in both modes, so labels are measured once
    if ONLY in (None, "hero"):
        for f in range(HERO_FRAMES):
            t = f / (HERO_FRAMES - 1)
            e = 2 * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 2 / 2
            aim(catmull(eyes, e), catmull(looks, e))
            render(os.path.join(OUT, mode, "hero", f"{f:04d}{EXT}"))
            if first:
                meta["hero"].append(labels())
    if ONLY in (None, "stops"):
        for i, (eye, look) in enumerate(VIEWS):
            aim(eye, look)
            render(os.path.join(OUT, mode, "stops", f"{i}{EXT}"))
            if first:
                meta["stops"].append(labels())

path = os.path.join(OUT, "labels.json")
if (ONLY or len(MODES) < 2) and os.path.exists(path):
    old = json.load(open(path))
    meta = {**old, **{k: v for k, v in meta.items() if v and k != "modes"}, "modes": ["day", "night"]}
with open(path, "w") as fh:
    json.dump(meta, fh)
print("RENDERED", len(meta["hero"]), "hero frames,", len(meta["stops"]), "stills,", MODES)