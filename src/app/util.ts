export default class Util {

    private static div = document.createElement('div');    

    public static htmlToText(html: string) {
        this.div.innerHTML = html;
        return this.div.textContent || this.div.innerText || '';
    }

    public static newKey() {
        return Array.from(Array(10)).reduce(a => a + Math.random().toString(36).substring(2, 15), '');
    }
}