const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('download-btn');

// Función para manejar el evento de arrastre sobre un editor
function handleDragOver(event) {
    event.preventDefault(); // Necesario para permitir el drop
}

// Función para manejar el drop de archivos
function handleDrop(event, type) {
    event.preventDefault();
    const files = event.dataTransfer.files; // Obtener los archivos arrastrados

    if (files.length > 0) {
        const file = files[0];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (type === 'html' && fileExtension === 'html') {
            loadFile(file, htmlEditor);
        } else if (type === 'css' && fileExtension === 'css') {
            loadFile(file, cssEditor);
        } else if (type === 'js' && fileExtension === 'js') {
            loadFile(file, jsEditor);
        } else {
            alert('Invalid file type. Please upload HTML, CSS, or JS files.');
        }
    }
}

// Función para cargar el archivo en el editor correspondiente
function loadFile(file, editor) {
    const reader = new FileReader();
    reader.onload = function(e) {
        editor.value = e.target.result;
        updatePreview();
    };
    reader.readAsText(file);
}

// Función para actualizar la vista previa
function updatePreview() {
    const htmlContent = htmlEditor.value;
    const cssContent = cssEditor.value;
    const jsContent = jsEditor.value;

    const iframeDocument = preview.contentDocument || preview.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${cssContent}</style>
        </head>
        <body>
            ${htmlContent}
            <script>${jsContent}</script>
        </body>
        </html>
    `);
    iframeDocument.close();
}

// Descargar los archivos como ZIP
downloadBtn.addEventListener('click', function() {
    const zip = new JSZip();

    zip.file("index.html", htmlEditor.value);
    zip.file("styles.css", cssEditor.value);
    zip.file("script.js", jsEditor.value);

    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'code_files.zip'; // Nombre del archivo ZIP
            link.click();
        });
});

// Inicializar vista previa
updatePreview();
