"""
Builds the portfolio's 3D world in Blender and exports it to public/models/pune.glb.

    blender -b --factory-startup --python blender/build_scene.py

Everything is procedural (seeded), so re-running gives the same scene.
Blender is Z-up; the glTF exporter converts to Y-up for three.js.

Exported nodes the site looks for by name:
    stop_0 … stop_6   empties marking each journey stop (see src/content.js)
    lattu             the spinning top that travels the route
    route             the glowing road between the stops
"""
import math
import random
import bpy
import bmesh
from mathutils import Vector, noise

random.seed(7)
OUT = bpy.path.abspath("//") or ""

# ── Reset ─────────────────────────────────────────────────────
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def material(name, color, rough=0.8, metal=0.0, emit=None, strength=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        m.surface_render_method = "BLENDED"
    return m


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


M = {
    "terrain": material("terrain", srgb("#1B1A3A"), 0.95),
    "ridge": material("ridge", srgb("#2A2756"), 0.95),
    "river": material("river", srgb("#16204F"), 0.15, emit=srgb("#3A4AA8"), strength=0.6),
    "road": material("road", srgb("#1A1830"), 0.9),
    "route": material("route", srgb("#F2B21B"), 0.4, emit=srgb("#F2B21B"), strength=2.2),
    "wall": material("wall", srgb("#2B2850"), 0.85),
    "wall_light": material("wall_light", srgb("#E9DFCF"), 0.7),
    "glass": material("glass", srgb("#3B4BB0"), 0.08, metal=0.2, emit=srgb("#5B6CFF"), strength=0.5),
    "glow": material("glow", srgb("#FFD58A"), 0.5, emit=srgb("#FFC766"), strength=3.0),
    "dome": material("dome", srgb("#E8E0D2"), 0.45, emit=srgb("#FFE9C2"), strength=0.35),
    "sindoor": material("sindoor", srgb("#E0442E"), 0.5),
    "haldi": material("haldi", srgb("#F2B21B"), 0.5),
    "indigo": material("indigo", srgb("#5B6CFF"), 0.5),
    "leaf": material("leaf", srgb("#2E9E62"), 0.7),
    "steel": material("steel", srgb("#B9B4AC"), 0.3, metal=1.0),
    "lac_red": material("lac_red", srgb("#E0442E"), 0.25),
    "lac_yellow": material("lac_yellow", srgb("#F2B21B"), 0.25),
    "lac_blue": material("lac_blue", srgb("#3346C9"), 0.25),
    "lac_ivory": material("lac_ivory", srgb("#FFF1E0"), 0.25),
    "lac_black": material("lac_black", srgb("#16110E"), 0.25),
}

# ── Window texture: lit and dark windows on a dark wall ───────
W = 128
img = bpy.data.images.new("windows", W, W)
px = [0.02, 0.02, 0.05, 1.0] * (W * W)  # dark wall; row 0 stays dark for roofs
for gy in range(1, W // 16):
    for gx in range(W // 16):
        if random.random() < 0.55:
            warm = random.choice([(1.0, 0.72, 0.3), (1.0, 0.85, 0.55), (0.95, 0.95, 1.0)])
            for y in range(gy * 16 + 5, gy * 16 + 12):
                for x in range(gx * 16 + 4, gx * 16 + 12):
                    px[(y * W + x) * 4:(y * W + x) * 4 + 4] = (*warm, 1)
img.pixels = px
img.pack()

win = bpy.data.materials.new("windows")
win.use_nodes = True
nt = win.node_tree
bsdf = nt.nodes["Principled BSDF"]
tex = nt.nodes.new("ShaderNodeTexImage")
tex.image = img
tex.interpolation = "Closest"
bsdf.inputs["Base Color"].default_value = (*srgb("#221F45"), 1)
bsdf.inputs["Roughness"].default_value = 0.8
nt.links.new(tex.outputs["Color"], bsdf.inputs["Emission Color"])
bsdf.inputs["Emission Strength"].default_value = 0.85
M["windows"] = win


def add_object(name, bm, mats):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    return ob


# ── Terrain: a valley ringed by Sahyadri ridges ───────────────
SIZE, SEG = 420.0, 150


def ground_height(x, y):
    r = math.hypot(x * 0.9, y)
    rim = max(0.0, (r - 46) / 50)
    rim = rim * rim * (3 - 2 * rim) if rim < 1 else 1.0
    n = 0.0
    amp, freq = 1.0, 0.025
    for _ in range(4):
        n += amp * noise.noise(Vector((x * freq, y * freq, 1.7)))
        amp *= 0.5
        freq *= 2.1
    hills = rim * (16 + 14 * n)
    floor = 0.35 * noise.noise(Vector((x * 0.05, y * 0.05, 4.2)))
    return max(hills, 0) + floor


bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=SEG, y_segments=SEG, size=SIZE / 2)
for v in bm.verts:
    v.co.z = ground_height(v.co.x, v.co.y)
for f in bm.faces:
    f.smooth = False
    f.material_index = 1 if sum(v.co.z for v in f.verts) / len(f.verts) > 9 else 0
add_object("terrain", bm, [M["terrain"], M["ridge"]])


# ── River (Mula-Mutha) ────────────────────────────────────────
def river_y(x):
    return -4 + 9 * math.sin(x * 0.045) + 3 * math.sin(x * 0.11 + 1)


bm = bmesh.new()
prev = None
for i in range(0, 121):
    x = -100 + i * (200 / 120)
    y = river_y(x)
    w = 2.2
    a = bm.verts.new((x, y - w, 0.12))
    b = bm.verts.new((x, y + w, 0.12))
    if prev:
        bm.faces.new((prev[0], prev[1], b, a))
    prev = (a, b)
add_object("river", bm, [M["river"]])

# ── Journey stops (positions match src/content.js order) ──────
STOPS = [
    ("stop_0", (-22, 14)),   # MIT-WPU
    ("stop_1", (-34, -14)),  # side projects
    ("stop_2", (-10, -24)),  # Research Copilot
    ("stop_3", (14, -20)),   # Supply Chain Command Center
    ("stop_4", (26, 2)),     # AyurGPT
    ("stop_5", (8, 22)),     # Augmented Transformations
    ("stop_6", (34, 36)),    # next stop
]
# The route runs just in front of each landmark (stop_N); labels sit on the landmark (mark_N).
ROUTE = [(x, y - 9) for _, (x, y) in STOPS]
for i, ((name, (x, y)), (rx, ry)) in enumerate(zip(STOPS, ROUTE)):
    for nm, (px_, py_) in ((name, (rx, ry)), (f"mark_{i}", (x, y))):
        e = bpy.data.objects.new(nm, None)
        e.location = (px_, py_, ground_height(px_, py_))
        scene.collection.objects.link(e)


def box(bm, cx, cy, w, d, h, z0=0.0, tile=3.0):
    """Box with world-scaled UVs so the window texture tiles evenly."""
    res = bmesh.ops.create_cube(bm, size=1.0)
    vs = res["verts"]
    for v in vs:
        v.co.x = cx + v.co.x * w
        v.co.y = cy + v.co.y * d
        v.co.z = z0 + (v.co.z + 0.5) * h
    uv = bm.loops.layers.uv.verify()
    faces = {f for v in vs for f in v.link_faces}
    for f in faces:
        n = f.normal
        for loop in f.loops:
            p = loop.vert.co
            if abs(n.z) > 0.5:
                loop[uv].uv = (0.01, 0.01)  # roof samples the dark wall
            elif abs(n.x) > 0.5:
                loop[uv].uv = ((p.y - cy) / tile, (p.z - z0) / tile + 0.125)
            else:
                loop[uv].uv = ((p.x - cx) / tile, (p.z - z0) / tile + 0.125)
    return faces


def near_stop(x, y, r):
    return any(math.hypot(x - sx, y - sy) < r for _, (sx, sy) in STOPS) or any(math.hypot(x - sx, y - sy) < r * 0.6 for sx, sy in ROUTE)


# ── City: generic blocks across the valley floor ──────────────
bm = bmesh.new()
placed = 0
while placed < 420:
    x, y = random.uniform(-44, 44), random.uniform(-40, 40)
    if math.hypot(x * 0.9, y) > 44 or abs(y - river_y(x)) < 5 or near_stop(x, y, 7):
        continue
    centre = 1 - min(1, math.hypot(x - 0, y - 0) / 44)
    h = random.uniform(2.5, 6) + centre * random.uniform(0, 14) * (random.random() < 0.3)
    box(bm, x, y, random.uniform(1.8, 3.6), random.uniform(1.8, 3.6), h, ground_height(x, y) - 0.2)
    placed += 1
add_object("city", bm, [M["windows"]])

# ── Landmarks, one per stop ───────────────────────────────────
def at(i):
    x, y = STOPS[i][1]
    return x, y, ground_height(x, y)


# 0 · MIT-WPU: a campus around a great dome.
x, y, z = at(0)
bm = bmesh.new()
for dx, dy, w, d, h in [(-7, -4, 6, 3, 5), (7, -4, 6, 3, 5), (-7, 5, 3, 7, 4), (7, 5, 3, 7, 4)]:
    box(bm, x + dx, y + dy, w, d, h, z - 0.2)
add_object("mitwpu_blocks", bm, [M["windows"]])
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=5.2, radius2=5.2, depth=3.2,
                      matrix=__import__("mathutils").Matrix.Translation((x, y, z + 1.6)))
add_object("mitwpu_drum", bm, [M["wall_light"]])
bm = bmesh.new()
bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=5.0,
                          matrix=__import__("mathutils").Matrix.Translation((x, y, z + 3.2)))
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < z + 3.15], context="VERTS")
add_object("mitwpu_dome", bm, [M["dome"]])
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.35, radius2=0.0, depth=2.4,
                      matrix=__import__("mathutils").Matrix.Translation((x, y, z + 9.3)))
add_object("mitwpu_spire", bm, [M["glow"]])

# 1 · Side projects: a hostel row with lit rooms.
x, y, z = at(1)
bm = bmesh.new()
for i in range(4):
    box(bm, x - 6 + i * 4, y + (i % 2) * 1.5, 3.2, 3.2, 6 + (i % 3) * 1.5, z - 0.2)
add_object("hostel", bm, [M["windows"]])

# 2 · Research Copilot: a library with a colonnade.
x, y, z = at(2)
bm = bmesh.new()
box(bm, x, y, 12, 6, 1.0, z - 0.2)
box(bm, x, y, 10.5, 5, 0.8, z + 5.2)
add_object("library_base", bm, [M["wall_light"]])
bm = bmesh.new()
M_ = __import__("mathutils").Matrix
for i in range(7):
    bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=0.35, radius2=0.35, depth=4.4,
                          matrix=M_.Translation((x - 4.5 + i * 1.5, y - 2.2, z + 3.0)))
add_object("library_columns", bm, [M["wall_light"]])
bm = bmesh.new()
box(bm, x, y + 0.6, 9, 3.4, 4.4, z + 0.8)
add_object("library_hall", bm, [M["glow"]])

# 3 · Supply Chain Command Center: a warehouse and stacked containers.
x, y, z = at(3)
bm = bmesh.new()
box(bm, x - 3, y + 2, 10, 7, 4.5, z - 0.2)
add_object("warehouse", bm, [M["windows"]])
cols = ["sindoor", "haldi", "indigo", "leaf"]
stacks = {c: bmesh.new() for c in cols}
for i in range(4):
    for j in range(2):
        for layer in range(1 + (i + j) % 3):
            box(stacks[random.choice(cols)], x + 5 + j * 2.7, y - 5 + i * 1.3, 2.5, 1.15, 1.2, z - 0.1 + layer * 1.22)
for c, bm in stacks.items():
    add_object(f"containers_{c}", bm, [M[c]])

# 4 · AyurGPT: a glass greenhouse with plants.
x, y, z = at(4)
bm = bmesh.new()
bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=12, radius=4.5, matrix=M_.Translation((x, y, z)))
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < z - 0.05], context="VERTS")
add_object("greenhouse", bm, [M["glass"]])
bm = bmesh.new()
for i in range(9):
    a = i / 9 * math.tau
    bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.6, radius2=0.0, depth=random.uniform(1.4, 2.6),
                          matrix=M_.Translation((x + math.cos(a) * 2.4, y + math.sin(a) * 2.4, z + 1)))
add_object("plants", bm, [M["leaf"]])

# 5 · Augmented Transformations: a glass office tower.
x, y, z = at(5)
bm = bmesh.new()
box(bm, x, y, 6, 6, 22, z - 0.2, tile=2.2)
box(bm, x + 5, y + 1, 5, 5, 12, z - 0.2, tile=2.2)
add_object("office", bm, [M["windows"]])
bm = bmesh.new()
for k in range(1, 6):
    box(bm, x, y, 6.15, 6.15, 0.18, z + k * 4.2)
add_object("office_bands", bm, [M["glass"]])

# 6 · Next stop: a road climbing out of the valley to a lit gate.
x, y, z = at(6)
bm = bmesh.new()
box(bm, x - 2.2, y, 0.6, 0.6, 6, z)
box(bm, x + 2.2, y, 0.6, 0.6, 6, z)
box(bm, x, y, 5.0, 0.6, 0.6, z + 6)
add_object("gate", bm, [M["glow"]])

# ── Route: a glowing road through the stops ───────────────────
pts = [Vector((sx, sy, 0)) for sx, sy in ROUTE]


def catmull(p0, p1, p2, p3, t):
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)


path = []
for i in range(len(pts) - 1):
    p0, p1, p2, p3 = pts[max(i - 1, 0)], pts[i], pts[i + 1], pts[min(i + 2, len(pts) - 1)]
    for s in range(24):
        path.append(catmull(p0, p1, p2, p3, s / 24))
path.append(pts[-1])
bm = bmesh.new()
prev = None
for i, p in enumerate(path):
    q = path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]
    side = Vector((-q.y, q.x, 0)).normalized() * 0.45
    zc = ground_height(p.x, p.y) + 0.25
    a = bm.verts.new((p.x - side.x, p.y - side.y, zc))
    b = bm.verts.new((p.x + side.x, p.y + side.y, zc))
    if prev:
        bm.faces.new((prev[0], prev[1], b, a))
    prev = (a, b)
add_object("route", bm, [M["route"]])

# ── The lattu: a spinning top, turned on a (virtual) lathe ────
profile = [(0.0, 0.0), (0.05, 0.05), (0.06, 0.32), (0.22, 0.45), (0.42, 0.72), (0.62, 1.05), (0.82, 1.42),
           (0.93, 1.72), (0.94, 1.9), (0.86, 2.1), (0.64, 2.3), (0.36, 2.44), (0.26, 2.56), (0.27, 2.72),
           (0.2, 2.88), (0.0, 2.95)]
bands = [(0.32, "steel"), (0.75, "lac_blue"), (1.62, "lac_red"), (1.95, "lac_yellow"), (2.42, "lac_ivory"), (3.0, "lac_red")]
bm = bmesh.new()
rings = []
SEGS = 48
for r, h in profile:
    ring = []
    for s in range(SEGS):
        a = s / SEGS * math.tau
        ring.append(bm.verts.new((math.cos(a) * r, math.sin(a) * r, h)))
    rings.append(ring)
mats = [m for _, m in bands]
for k in range(len(rings) - 1):
    mid = (profile[k][1] + profile[k + 1][1]) / 2
    mi = next(i for i, (lim, _) in enumerate(bands) if mid <= lim)
    for s in range(SEGS):
        f = bm.faces.new((rings[k][s], rings[k][(s + 1) % SEGS], rings[k + 1][(s + 1) % SEGS], rings[k + 1][s]))
        f.material_index = mi
        f.smooth = True
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
lattu = add_object("lattu", bm, [M[m] for m in mats])
lattu.location = (0, 0, -50)  # parked out of sight; the site moves it

# ── Export ────────────────────────────────────────────────────
import os
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "..", "public", "models", "pune.glb")
os.makedirs(os.path.dirname(out), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=out,
    export_format="GLB",
    export_apply=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_extras=False,
    export_cameras=False,
    export_lights=False,
)
print("EXPORTED", out, os.path.getsize(out))
