const fs = require('fs');
const esbuild = require('esbuild');

const entryPoint = `src/index`;

(async function () {

    const del = (fn) => {try {fs.unlinkSync(fn)} catch (e) {}}

    const outfile = `./app.js`;

    await esbuild.build({
        entryPoints: [`./${entryPoint}.ts`],
        bundle: true,
        minify: false,
        treeShaking: true,
        outfile: outfile,
        sourcemap: false
    });

    fs.writeFileSync('./index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>chaaart</title>
    <style>${fs.readFileSync('./src/style.css') + ''}</style>
</head>
<body>
    ${fs.readFileSync('./src/app.html') + ''}
    <script>${fs.readFileSync(outfile) + ''}</script>
</body>
</html>
`)

    del(outfile)
    del(`./${entryPoint}.js`)
    del(`./${entryPoint}.js.map`)
})();

