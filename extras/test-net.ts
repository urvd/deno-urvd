const response = await fetch('https://deno.land/std/examples/testdata/catj/array.json');
const body = await response.json();
console.log(body);