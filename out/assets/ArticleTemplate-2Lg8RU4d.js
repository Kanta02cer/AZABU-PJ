import{r as N,j as e,L as a}from"./index-CkcB1Nfq.js";import{a as r}from"./useScrollAnimation-Bi2yDJCd.js";function y({title:l,subtitle:i,date:m,category:x,thumbnail:h,content:g,tags:n=[],relatedArticles:o=[],type:s}){const{ref:p,isVisible:b}=r(),{ref:f,isVisible:u}=r(),{ref:j,isVisible:w}=r();N.useEffect(()=>{window.scrollTo(0,0)},[]);const c=t=>new Date(t).toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric"});return e.jsxs("div",{className:"min-h-screen bg-white",children:[e.jsx("div",{className:"bg-slate-50 border-b border-slate-200",children:e.jsx("div",{className:"max-w-4xl mx-auto px-4 py-4",children:e.jsxs("nav",{className:"flex items-center space-x-2 text-sm text-slate-600",children:[e.jsx(a,{to:"/",className:"hover:text-[#FF6B00] transition-colors whitespace-nowrap",children:"ホーム"}),e.jsx("span",{className:"shrink-0",children:"/"}),e.jsx(a,{to:s==="news"?"/news":"/column",className:"hover:text-[#FF6B00] transition-colors whitespace-nowrap",children:s==="news"?"ニュース":"コラム"}),e.jsx("span",{className:"shrink-0",children:"/"}),e.jsx("span",{className:"text-slate-400 line-clamp-1",children:l})]})})}),e.jsxs("article",{className:"max-w-4xl mx-auto px-4 py-12",children:[e.jsxs("div",{ref:p,className:`transition-all duration-1000 ${b?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[e.jsxs("div",{className:"flex items-center space-x-4 mb-6",children:[e.jsx("span",{className:`inline-block px-4 py-1.5 text-white text-sm font-bold rounded-full ${s==="news"?"bg-[#FF6B00]":"bg-[#1A1A2E]"}`,children:x}),e.jsx("time",{className:"text-slate-500 text-sm",children:c(m)})]}),e.jsx("h1",{className:"text-3xl md:text-5xl font-black text-[#1A1A2E] mb-6 leading-tight",children:l}),i&&e.jsx("p",{className:"text-lg text-slate-600 leading-relaxed mb-8 font-medium",children:i}),n.length>0&&e.jsx("div",{className:"flex flex-wrap gap-2 mb-8",children:n.map((t,d)=>e.jsx("span",{className:"px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200",children:t},d))}),e.jsx("div",{className:"relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl",children:e.jsx("img",{src:h,alt:l,className:"w-full h-full object-cover"})})]}),e.jsx("div",{ref:f,className:`transition-all duration-1000 delay-200 ${u?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:e.jsx("div",{className:"prose prose-lg max-w-none article-content",style:{"--tw-prose-headings":"#1A1A2E","--tw-prose-body":"#334155","--tw-prose-bullets":"#FF6B00","--tw-prose-quote-borders":"#FF6B00"},dangerouslySetInnerHTML:{__html:g}})}),e.jsx("style",{children:`
          .article-content h2 {
            font-size: 1.5rem;
            font-weight: 800;
            border-left: 4px solid #FF6B00;
            padding-left: 1rem;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
          }
          .article-content h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .article-content p {
            line-height: 2;
            margin-bottom: 1.5rem;
          }
          .article-content blockquote {
            background: linear-gradient(135deg, #FAFAFA, #FFF8F0);
            border-left: 4px solid #FF6B00;
            padding: 2rem;
            border-radius: 1rem;
            font-style: italic;
            margin: 2rem 0;
          }
          .article-content .highlight-box {
            background: linear-gradient(135deg, #1A1A2E, #0F0F1A);
            color: #FFF;
            padding: 2.5rem;
            border-radius: 1.5rem;
            margin: 3rem 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .article-content .highlight-box h3 {
            color: #FF6B00;
            margin-top: 0;
          }
          .article-content .highlight-box p {
            color: rgba(255,255,255,0.8);
            margin-bottom: 0;
          }
          .article-content .qa-section {
            margin-bottom: 3rem;
          }
          .article-content .qa-question {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .article-content .qa-badge {
            flex-shrink: 0;
            width: 3rem;
            height: 3rem;
            background: linear-gradient(135deg, #FF6B00, #FF8C00);
            border-radius: 0.75rem;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(255,107,0,0.2);
          }
          .article-content .qa-question h2 {
            border-left: none;
            padding-left: 0;
            margin: 0;
            padding-top: 0.5rem;
            font-size: 1.25rem;
          }
          .article-content .qa-answer {
            margin-left: 4rem;
            padding-left: 1.5rem;
            border-left: 2px solid rgba(255,107,0,0.2);
          }
          @media (max-width: 640px) {
            .article-content .qa-answer {
              margin-left: 0;
              padding-left: 1.25rem;
              margin-top: 1rem;
            }
          }
        `}),e.jsxs("div",{className:"mt-16 pt-8 border-t border-slate-200",children:[e.jsx("p",{className:"text-sm text-slate-600 mb-4",children:"この記事をシェア"}),e.jsxs("div",{className:"flex space-x-3",children:[e.jsx("button",{className:"w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#FF6B00] text-slate-600 hover:text-white rounded-full transition-all duration-300",children:e.jsx("i",{className:"ri-twitter-x-line text-lg"})}),e.jsx("button",{className:"w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#FF6B00] text-slate-600 hover:text-white rounded-full transition-all duration-300",children:e.jsx("i",{className:"ri-facebook-fill text-lg"})}),e.jsx("button",{className:"w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#FF6B00] text-slate-600 hover:text-white rounded-full transition-all duration-300",children:e.jsx("i",{className:"ri-line-fill text-lg"})})]})]})]}),o.length>0&&e.jsx("section",{className:"bg-slate-50 py-16",children:e.jsx("div",{className:"max-w-6xl mx-auto px-4",children:e.jsxs("div",{ref:j,className:`transition-all duration-1000 ${w?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`,children:[e.jsx("h2",{className:"text-2xl font-bold text-[#1A2B4C] mb-8",children:"関連記事"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:o.slice(0,3).map(t=>e.jsxs(a,{to:`/${s}/${t.id}`,className:"group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2",children:[e.jsxs("div",{className:"relative w-full aspect-video overflow-hidden",children:[e.jsx("img",{src:t.thumbnail,alt:t.title,className:"w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"}),e.jsx("span",{className:"absolute top-3 left-3 px-3 py-1 bg-[#FF6B00] text-white text-xs font-medium rounded-full",children:t.category})]}),e.jsxs("div",{className:"p-5",children:[e.jsx("time",{className:"text-xs text-slate-500 mb-2 block",children:c(t.date)}),e.jsx("h3",{className:"text-base font-bold text-[#334155] group-hover:text-[#FF6B00] transition-colors line-clamp-2",children:t.title})]})]},t.id))})]})})}),e.jsx("div",{className:"max-w-4xl mx-auto px-4 py-12",children:e.jsxs(a,{to:s==="news"?"/news":"/column",className:"inline-flex items-center space-x-2 text-[#1A2B4C] hover:text-[#FF6B00] font-medium transition-colors group",children:[e.jsx("i",{className:"ri-arrow-left-line text-xl group-hover:-translate-x-1 transition-transform"}),e.jsxs("span",{children:[s==="news"?"ニュース":"コラム","一覧に戻る"]})]})})]})}export{y as A};
//# sourceMappingURL=ArticleTemplate-2Lg8RU4d.js.map
