const fileInput=document.getElementById('pdfInput');
const pdfContainer=document.getElementById('canvas-container');
const canvas=document.getElementById('pdfCanvas');
let currentscale=1.5;
let pdfDoc=null;
const ctx=canvas.getContext('2d');
let currentPage=1;
pdfjsLib.GlobalWorkerOptions.workerSrc = 
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
;
fileInput.addEventListener('click',(e)=>{
    const file=e.target.files[0];
    if(file){
        const fileReader=new FileReader();
        fileReader.onload=function(){
            loadpdf(this.result)
        };
        fileReader.readAsArrayBuffer(file)
        
    }
})
function loadpdf(arrayBuffer){
pdfjsLib.getDocument({data:arrayBuffer}).promise.then(pdf=>
{
    pdfDoc=pdf;
    currentPage=1;
    currentscale=1.5;
    renderpage(currentPage,currentscale)

}
)
}
function renderpage(pagenum,scale){
    if(!pdfDoc) return;
    pdfContainer.scrollLeft=0;
    pdfContainer.scrollTop=0;
    pdfDoc.getPage(pagenum).then(page=>{
        const viewport=page.getViewport({scale});
        canvas.height=viewport.height;
        canvas.width=viewport.width;
        const Context={
            canvasContext:ctx,
            viewport:viewport,
            

        }
        page.render(Context).promise.then(()=>{
            updatePageDisplay();
        })
    })
}
function updatePageDisplay(){
    document.getElementById('pageNum').textContent=`page${currentPage}
    of ${pdfDoc.numPages}`
};
document.getElementById('prevPage').addEventListener('click',()=>{
    if(currentPage>1){
        currentPage--;
        renderpage(currentPage,currentscale)
    }else {
        currentPage===1;
    }
});
document.getElementById('nextPage').addEventListener('click',()=>{
    if(pdfDoc && currentPage< pdfDoc.numpages){
        currentPage++;
        renderpage(currentPage,currentscale)
    }else{
        console.warn(`please put a pdf`)
    }
});

document.getElementById('zoomIn').addEventListener('click',()=>{
    currentScale*=1.2;
    currentscale=Math.min(currentscale,5);
    renderpage(currentPage,currentscale)
});
document.getElementById('zoomOut').addEventListener('click',()=>{
    currentscale/=1.2;
    currentscale=Math.max(currentscale,0.3)
    ;
    renderpage(currentscale,currentPage)
})
let isdrag=false;
let startx,starty,scrolleft,scroltop;
pdfContainer.addEventListener('mousedown',(e)=>{
    isdrag=true;
    startx=e.pageX - pdfContainer.offsetLeft;
    starty=e.pageY - pdfContainer.offsetTop;
    scrolleft=pdfContainer.scrollLeft;
    scroltop=pdfContainer.scrollTop;
    pdfContainer.style.cursor='grabbing';
})
pdfContainer.addEventListener('mouseup',()=>{
    isdrag=false;
    pdfContainer.style.cursor='grab';

});
pdfContainer.addEventListener('mousemove',(e)=>{
    e.preventDefault();
    if(!isdrag)return;
    const x=e.pageX -pdfContainer.offsetLeft;
    const y=e.pageY - pdfContainer.offsetTop;
    const walkx=(x - startx) *2;
    const walky=(y - starty) * 2;
    pdfContainer.scrollLeft=scrolleft - walkx;
    pdfContainer.scrollTop=scrollTop - walky;
})