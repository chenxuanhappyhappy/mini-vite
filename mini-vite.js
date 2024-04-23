const Koa = require('koa');
const path = require('path');
const fs = require('fs');

const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');

const app = new Koa();

app.use(async (ctx) => {
    const { url, query } = ctx.request;

    if (url === '/') {
        ctx.type = 'text/html';
        ctx.body = fs.readFileSync('./index.html', 'utf-8');
    } else if (url.endsWith('.js')) {
        const filePath = path.join(__dirname, url);
        const file = fs.readFileSync(filePath, 'utf-8');
        ctx.type = 'application/javascript';
        ctx.body = rewriteImport(file);
    } else if (url.startsWith('/@modules/')) {
        ctx.type = 'application/javascript';
        const filePrefix = path.resolve(
            __dirname,
            'node_modules',
            url.replace('/@modules/', '')
        );
        const module = require(filePrefix + '/package.json').module;
        const file = fs.readFileSync(filePrefix + '/' + module, 'utf-8');
        ctx.body = rewriteImport(file);
    } else if (url.includes('.vue')) {
        const filePath = path.resolve(__dirname, url.slice(1).split("?")[0]);
        const { descriptor } = compilerSfc.parse(
            fs.readFileSync(filePath, 'utf-8')
        );
        if (!query.type) {
            const scriptContent = descriptor.script.content;
            const script = scriptContent.replace('export default', 'const __script = ');
            ctx.type = 'text/javascript'
            ctx.body = `
                ${rewriteImport(script)}
                ${descriptor.styles.length ? `import "${url}?type=style"` : ""}
                import { render as __render } from '${url}?type=template'
                __script.render = __render
                export default __script
            `;
        } else if (query.type === 'template') {
            const templateContent = descriptor.template.content;
            const render = compilerDom.compile(templateContent, {
              mode: 'module'
            }).code
            ctx.type = "application/javascript"
            ctx.body = rewriteImport(render);
        } else if (query.type === 'style') {
            const styleBlock = descriptor.styles[0];
            ctx.type = 'application/javascript';
            ctx.body = `
                const css = ${JSON.stringify(styleBlock.content)};
                updateStyle(css);
                export default css;
            `;
        }
    } else if (url.endsWith('.jpg')) {
        const filePath = path.join(__dirname, 'src/' + url);
        ctx.body = fs.readFileSync(filePath);
    }
}) 

app.listen(3000, function() {
    console.log('started vited');
})

function rewriteImport(content) {
    return content.replace(/ from ['"](.*)['"]/g, (s1, s2) => {
        if (s2.startsWith('./') || s2.startsWith('/') || s2.startsWith('../')) {
            return s1;
        } else {
            return ` from "/@modules/${s2}"`;
        }
    });
}