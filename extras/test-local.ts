
// read
const content = await Deno.readTextFile("file.txt");
console.log(content);

//write
await Deno.writeTextFile("file.txt", "to write anything.");
