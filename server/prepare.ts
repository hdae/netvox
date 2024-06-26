import { basename, resolve } from "!std/path/mod.ts"

const { dirname } = import.meta

if (dirname === undefined) throw new Error("Failed to get dirname.")
Deno.chdir(resolve(dirname, "netvox_core"))

// Relocate files
const dir_mod = resolve(dirname, "lib")

if (await Deno.stat(dir_mod).then(stat => stat.isDirectory).catch(() => false)) {
    await Deno.remove(dir_mod, { recursive: true })
}

await Deno.mkdir(dir_mod)

// await Deno.copyFile(
//     resolve(dirname, "netvox_core", "bindings", "bindings.ts"),
//     resolve(dir_mod, "mod.ts")
// )

const mod_file = await Deno.readTextFile(resolve(dirname, "netvox_core", "bindings", "bindings.ts"))
const mod_fixed = mod_file.replace(
    "const url = new URL(\".\", import.meta.url)",
    [
        "import { toFileUrl } from \"!std/path/mod.ts\"",
        "const url = new URL(\".\", toFileUrl(Deno.execPath()))",
    ].join("\n")
)
await Deno.writeTextFile(resolve(dir_mod, "mod.ts"), mod_fixed)

for (const ext of ["dll", "so", "dylib"]) {
    const file_lib = resolve(dirname, "netvox_core", "target", "release", `netvox_core.${ext}`)
    if (await Deno.stat(file_lib).then(stat => stat.isFile).catch(() => false)) {
        Deno.copyFile(
            file_lib,
            resolve(dir_mod, basename(file_lib))
        )
    }
}
