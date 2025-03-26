document.addEventListener("DOMContentLoaded", async () => {
    // Carica gli stili dal JSON
    const response = await fetch("styles.json");
    const styles = await response.json();
    Object.entries(styles).forEach(([selector, rules]) => {
        document.querySelectorAll(selector).forEach(el => {
            Object.assign(el.style, rules);
        });
    });

    document.getElementById("fetchArticle").addEventListener("click", async () => {
        const url = document.getElementById("url").value;
        if (!url) return alert("Inserisci un URL valido!");
        
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, "text/html");
            
            // Estrai titolo, autore, contenuto principale (esempio basato su classi comuni)
            const title = doc.querySelector("h1")?.innerText || "Titolo sconosciuto";
            const author = doc.querySelector("[name='author']")?.content || "Autore sconosciuto";
            const content = doc.querySelector("article")?.innerHTML || "<p>Contenuto non disponibile</p>";

            document.getElementById("content").innerHTML = `<h2>${title}</h2><h3>${author}</h3>${content}`;
        } catch (error) {
            alert("Errore durante il recupero dell'articolo");
        }
    });

    document.getElementById("exportPDF").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(document.getElementById("content").innerText, 10, 10);
        doc.save("articolo.pdf");
    });

    document.getElementById("exportEPUB").addEventListener("click", () => {
        const content = document.getElementById("content").innerHTML;
        const epub = ePub();
        epub.generate("blob").then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "articolo.epub";
            a.click();
        });
    });
});