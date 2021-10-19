
import { copy } from "https://deno.land/std@0.110.0/fs/copy.ts";

await copy('file.txt', 'file_copy.txt');
console.log(("done !!"));
