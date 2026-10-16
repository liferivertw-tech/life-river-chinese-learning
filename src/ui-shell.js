export function renderShell(root,categories){
 const symbols=['🎙️','ㄅ','ā','字','📖','💬','🎧','📝','🏮','💼','💻','🎓'];
 const colors=['pink','peach','yellow','green','teal','sky','blue','violet','rose','plum','lilac','sand'];
 const tiles=categories.map(([id,title],i)=>'<button type="button" class="category-tile '+colors[i]+'" data-category="'+id+'"><span class="tile-icon">'+symbols[i]+'</span><span class="tile-title">'+title+'</span><span class="tile-arrow">›</span></button>').join('');
 root.innerHTML=[
 '<header class="site-header">',
 '<a href="#home" class="brand" aria-label="LIFE RIVER Chinese Learning Hub"><span class="logo-container"><img class="brand-logo" src="Life%20River-logo-h-final.png" alt="Life River"></span><span class="brand-caption"><strong>Chinese Learning Hub</strong><small>生命河｜中文學習資源網</small></span></a>',
 '<nav id="mainNav" class="site-nav" aria-label="Navigation"><a href="#home">首頁</a><a href="#goals">學習目標</a><a href="#learningPath">學習路徑</a><a href="#resources">學習資源</a></nav>',
 '<label class="language-picker"><span>🌐 <b>介面語言</b></span><select id="lang" aria-label="介面語言"></select></label>',
 '<button type="button" id="menuToggle" class="menu-toggle" aria-expanded="false" aria-controls="mainNav">☰</button>',
 '</header>',
 '<main id="home">',
 '<section class="hero"><div class="hero-decor hero-decor-left" aria-hidden="true">🏮</div><div class="hero-decor hero-decor-right" aria-hidden="true">漢</div><div class="hero-inner">',
 '<p class="hero-eyebrow" id="heroEyebrow"></p><h1></h1><p class="hero-en"></p><p class="hero-intro"></p><p class="hero-sub"></p>',
 '<div class="hero-actions"><a href="#goals" class="primary-cta hero-primary"></a><a href="#learningPath" class="secondary-cta hero-secondary"></a></div>',
 '<div class="hero-proof"><span>15</span><span class="hero-proof-label"></span></div>',
 '</div></section>',
 '<section id="goals" class="goals-section"><div class="section-heading centered"><p class="section-kicker">01</p><h2></h2><p class="section-intro"></p></div><div id="goalGrid" class="goal-grid"></div><aside id="goalStartPanel" class="goal-start-panel" hidden><div><p class="goal-start-title"></p><p class="goal-start-body"></p><div class="goal-level-control"><label class="goal-level-label" for="goalLevel"></label><select id="goalLevel" class="goal-level-select"></select></div></div><button type="button" class="goal-start-action secondary-cta"></button></aside></section>',
 '<section id="learningPath" class="learning-path"><div class="section-heading"><div><p class="section-kicker">02</p><h2></h2><p class="learning-path-intro"></p></div></div><div id="pathGrid" class="path-grid"></div></section>',
 '<section id="resources" class="resource-section"><div class="section-heading"><div><p class="section-kicker">03</p><h2></h2><p class="resource-section-intro"></p></div><a href="#allResources" class="section-link resource-more-link"></a></div><p id="resourceRecommendationNote" class="resource-recommendation-note"></p><div class="resource-recommendation-legend"><strong class="trust-heading"></strong><span class="trust-dot trust-a"></span><span class="legend-verified-label"></span><span class="trust-dot trust-b"></span><span class="legend-pending-label"></span><span class="trust-dot trust-c"></span><span class="trust-c-label"></span></div><div id="resourceFeature" class="resource-feature-grid"></div></section>',
 '<section id="directory" class="directory-section"><div class="section-heading"><div><p class="section-kicker">04</p><h2></h2></div><a href="#allResources" class="section-link"></a></div><div class="category-grid">'+tiles+'</div></section>',
 '<section id="features" class="features-section"><div class="section-heading centered"><p class="section-kicker">05</p><h2></h2></div><div id="featureGrid" class="feature-grid"></div></section>',
 '<section id="gap" class="gap-section"><div class="gap-card"><div><p class="section-kicker">06</p><h2></h2><p id="gapIntro"></p><div id="gapStats" class="gap-stats"></div></div><button id="gapAction" class="secondary-cta" type="button"></button></div></section>',
 '<section id="allResources" class="all-resources"><div class="section-heading"><div><p class="section-kicker">07</p><h2></h2></div></div>',
 '<form id="searchForm" class="search-panel" role="search"><label class="search-box"><span>⌕</span><input id="searchInput" type="search"></label><button type="submit" class="search-button"></button></form>',
 '<div class="quick-links"><span class="quick-label"></span><button type="button" data-query="TOCFL" data-category="tocfl"></button><button type="button" data-query="pronunciation"></button><button type="button" data-query="vocabulary"></button><button type="button" data-query="daily"></button></div>',
 '<div class="filters"><label><span></span><select id="categoryFilter"></select></label><label><span></span><select id="levelFilter"></select></label><button type="button" id="clearFilters" class="clear-button"></button></div><div id="resourceResults" class="resource-grid"></div></section>',
 '<section id="about" class="about"><p class="section-kicker">08</p><h2></h2><p></p></section><aside id="notice" role="status"></aside></main>',
 '<footer id="siteFooter"></footer>'
 ].join('');
}
