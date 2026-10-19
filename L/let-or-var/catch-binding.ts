// control: A catch variable is bound by the throw, and the handler never assigns it.
try {
  JSON.parse("{");
}
catch (error) {
  console.log(error instanceof SyntaxError);
}
