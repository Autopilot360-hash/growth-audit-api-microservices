import https from 'https';
import http from 'http';
import { URL } from 'url';

export class TechnicalSEOAnalyzer {
  constructor() {
    this.userAgent = 'Growth-Audit-Bot/1.0';
  }

  async auditSite(url, options = {}) {
    const siteUrl = new URL(url);
    
    const audit = {
      url: url,
      domain: siteUrl.hostname,
      audited_at: new Date().toISOString(),
      technical_score: 0,
      categories: {
        crawlability: await this.auditCrawlability(siteUrl),
        page_speed: await this.auditPageSpeed(siteUrl),
        mobile_optimization: await this.auditMobile(siteUrl),
        meta_tags: await this.auditMetaTags(siteUrl),
        schema_markup: await this.auditSchemaMarkup(siteUrl),
        internal_linking: await this.auditInternalLinking(siteUrl),
        technical_issues: await this.auditTechnicalIssues(siteUrl),
        security: await this.auditSecurity(siteUrl)
      },
      priority_recommendations: [],
      action_plan: {}
    };

    // Calculer le score global
    audit.technical_score = this.calculateOverallScore(audit.categories);
    
    // Générer les recommandations prioritaires
    audit.priority_recommendations = this.generatePriorityRecommendations(audit.categories);
    
    // Créer un plan d'action
    audit.action_plan = this.createActionPlan(audit.categories);

    return audit;
  }

  async auditCrawlability(siteUrl) {
    const checks = {
      robots_txt: await this.checkRobotsTxt(siteUrl),
      sitemap_xml: await this.checkSitemapXml(siteUrl),
      crawl_errors: await this.checkCrawlErrors(siteUrl),
      redirect_chains: await this.checkRedirectChains(siteUrl),
      canonical_tags: await this.checkCanonicalTags(siteUrl)
    };

    const score = this.calculateCategoryScore(checks);

    return {
      score,
      checks,
      recommendations: this.generateCrawlabilityRecommendations(checks)
    };
  }

  async auditPageSpeed(siteUrl) {
    const metrics = await this.analyzePageSpeed(siteUrl);
    
    const checks = {
      load_time: {
        value: metrics.load_time,
        status: metrics.load_time < 3000 ? 'good' : metrics.load_time < 5000 ? 'warning' : 'critical'
      },
      first_contentful_paint: {
        value: metrics.fcp,
        status: metrics.fcp < 1800 ? 'good' : metrics.fcp < 3000 ? 'warning' : 'critical'
      },
      largest_contentful_paint: {
        value: metrics.lcp,
        status: metrics.lcp < 2500 ? 'good' : metrics.lcp < 4000 ? 'warning' : 'critical'
      },
      cumulative_layout_shift: {
        value: metrics.cls,
        status: metrics.cls < 0.1 ? 'good' : metrics.cls < 0.25 ? 'warning' : 'critical'
      }
    };

    const score = this.calculateCategoryScore(checks);

    return {
      score,
      metrics,
      checks,
      recommendations: this.generatePageSpeedRecommendations(checks)
    };
  }

  async auditMobile(siteUrl) {
    const checks = {
      mobile_friendly: await this.checkMobileFriendly(siteUrl),
      viewport_meta: await this.checkViewportMeta(siteUrl),
      touch_elements: await this.checkTouchElements(siteUrl),
      responsive_images: await this.checkResponsiveImages(siteUrl),
      amp_pages: await this.checkAMPPages(siteUrl)
    };

    const score = this.calculateCategoryScore(checks);

    return {
      score,
      checks,
      recommendations: this.generateMobileRecommendations(checks)
    };
  }

  async auditMetaTags(siteUrl) {
    const pageContent = await this.fetchPageContent(siteUrl);
    
    const checks = {
      title_tag: this.checkTitleTag(pageContent),
      meta_description: this.checkMetaDescription(pageContent),
      heading_structure: this.checkHeadingStructure(pageContent),
      alt_attributes: this.checkAltAttributes(pageContent),
      og_tags: this.checkOpenGraphTags(pageContent)
    };

    const score = this.calculateCategoryScore(checks);

    return {
      score,
      checks,
      recommendations: this.generateMetaTagRecommendations(checks)
    };
  }

  async auditSchemaMarkup(siteUrl) {
    const pageContent = await this.fetchPageContent(siteUrl);
    
    const checks = {
      structured_data_present: this.checkStructuredData(pageContent),
      organization_schema: this.checkOrganizationSchema(pageContent),
      breadcrumb_schema: this.checkBreadcrumbSchema(pageContent),
      product_schema: this.checkProductSchema(pageContent),
      review_schema: this.checkReviewSchema(pageContent)
    };

    const score = this.calculateCategoryScore(checks);

    return {
      score,
      checks,
      recommendations: this.generateSchemaRecommendations(checks)
    };
  }

  // Méthodes utilitaires pour les vérifications

  async checkRobotsTxt(siteUrl) {
    try {
      const robotsUrl = `${siteUrl.protocol}//${siteUrl.hostname}/robots.txt`;
      const content = await this.fetchContent(robotsUrl);
      
      return {
        present: true,
        allows_crawling: !content.includes('Disallow: /'),
        has_sitemap_directive: content.includes('Sitemap:'),
        status: 'good'
      };
    } catch (error) {
      return {
        present: false,
        status: 'warning',
        message: 'robots.txt not found'
      };
    }
  }

  async checkSitemapXml(siteUrl) {
    try {
      const sitemapUrl = `${siteUrl.protocol}//${siteUrl.hostname}/sitemap.xml`;
      await this.fetchContent(sitemapUrl);
      
      return {
        present: true,
        status: 'good',
        accessible: true
      };
    } catch (error) {
      return {
        present: false,
        status: 'critical',
        message: 'sitemap.xml not found'
      };
    }
  }

  async analyzePageSpeed(siteUrl) {
    // Simulation de métriques - en production, utiliser Google PageSpeed Insights API
    return {
      load_time: Math.floor(Math.random() * 6000) + 1000, // 1-7 secondes
      fcp: Math.floor(Math.random() * 3000) + 500, // 0.5-3.5 secondes
      lcp: Math.floor(Math.random() * 4000) + 1000, // 1-5 secondes
      cls: (Math.random() * 0.5).toFixed(3), // 0-0.5
      tti: Math.floor(Math.random() * 8000) + 2000 // 2-10 secondes
    };
  }

  async fetchPageContent(siteUrl) {
    try {
      const content = await this.fetchContent(siteUrl.href);
      return content;
    } catch (error) {
      return '';
    }
  }

  checkTitleTag(content) {
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    return {
      present: !!title,
      length: title.length,
      optimal_length: title.length >= 30 && title.length <= 60,
      content: title,
      status: title.length >= 30 && title.length <= 60 ? 'good' : 'warning'
    };
  }

  checkMetaDescription(content) {
    const descMatch = content.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    return {
      present: !!description,
      length: description.length,
      optimal_length: description.length >= 120 && description.length <= 160,
      content: description,
      status: description.length >= 120 && description.length <= 160 ? 'good' : 'warning'
    };
  }

  checkHeadingStructure(content) {
    const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
    
    return {
      h1_count: h1Count,
      h2_count: h2Count,
      proper_h1_usage: h1Count === 1,
      hierarchical_structure: h2Count > 0,
      status: h1Count === 1 && h2Count > 0 ? 'good' : 'warning'
    };
  }

  calculateCategoryScore(checks) {
    const statusValues = { good: 100, warning: 50, critical: 0 };
    const scores = Object.values(checks).map(check => 
      statusValues[check.status] || (check.status ? 100 : 0)
    );
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  calculateOverallScore(categories) {
    const categoryScores = Object.values(categories).map(cat => cat.score);
    return Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length);
  }

  generatePriorityRecommendations(categories) {
    const recommendations = [];
    
    // Recommandations basées sur les scores les plus faibles
    Object.entries(categories).forEach(([category, data]) => {
      if (data.score < 70) {
        recommendations.push({
          category,
          priority: data.score < 50 ? 'HIGH' : 'MEDIUM',
          score: data.score,
          top_issues: data.recommendations?.slice(0, 2) || [],
          estimated_impact: 'Improve SEO ranking and user experience'
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  createActionPlan(categories) {
    return {
      immediate_actions: this.getImmediateActions(categories),
      short_term: this.getShortTermActions(categories),
      long_term: this.getLongTermActions(categories),
      estimated_timeline: '2-8 weeks for full implementation'
    };
  }

  // Méthodes utilitaires supplémentaires
  async fetchContent(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https:') ? https : http;
      
      client.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
    });
  }

  generateCrawlabilityRecommendations(checks) {
    const recommendations = [];
    
    if (!checks.robots_txt.present) {
      recommendations.push({
        action: 'Create robots.txt file',
        priority: 'HIGH',
        effort: 'Low'
      });
    }
    
    if (!checks.sitemap_xml.present) {
      recommendations.push({
        action: 'Generate and submit XML sitemap',
        priority: 'HIGH',
        effort: 'Medium'
      });
    }

    return recommendations;
  }

  generatePageSpeedRecommendations(checks) {
    const recommendations = [];
    
    if (checks.load_time.status !== 'good') {
      recommendations.push({
        action: 'Optimize page load time',
        suggestions: ['Compress images', 'Minify CSS/JS', 'Enable caching'],
        priority: 'HIGH'
      });
    }

    return recommendations;
  }

  generateMobileRecommendations(checks) {
    const recommendations = [];
    
    if (!checks.mobile_friendly.status) {
      recommendations.push({
        action: 'Implement responsive design',
        priority: 'HIGH',
        impact: 'Mobile search rankings'
      });
    }

    return recommendations;
  }

  generateMetaTagRecommendations(checks) {
    const recommendations = [];
    
    if (!checks.title_tag.optimal_length) {
      recommendations.push({
        action: 'Optimize title tag length (30-60 characters)',
        current_length: checks.title_tag.length,
        priority: 'MEDIUM'
      });
    }

    return recommendations;
  }

  generateSchemaRecommendations(checks) {
    const recommendations = [];
    
    if (!checks.structured_data_present.status) {
      recommendations.push({
        action: 'Implement structured data markup',
        priority: 'MEDIUM',
        benefit: 'Rich snippets in search results'
      });
    }

    return recommendations;
  }

  // Méthodes d'actions
  getImmediateActions(categories) {
    return [
      'Fix critical crawlability issues',
      'Optimize title tags and meta descriptions',
      'Resolve mobile-friendliness issues'
    ];
  }

  getShortTermActions(categories) {
    return [
      'Improve page speed metrics',
      'Implement structured data',
      'Optimize internal linking structure'
    ];
  }

  getLongTermActions(categories) {
    return [
      'Comprehensive technical SEO audit',
      'Advanced schema markup implementation',
      'Performance monitoring setup'
    ];
  }

  // Méthodes de vérification supplémentaires (stubs pour l'exemple)
  async checkCrawlErrors(siteUrl) { return { status: 'good', errors_found: 0 }; }
  async checkRedirectChains(siteUrl) { return { status: 'good', chains_found: 0 }; }
  async checkCanonicalTags(siteUrl) { return { status: 'good', properly_implemented: true }; }
  async checkMobileFriendly(siteUrl) { return { status: true, mobile_friendly: true }; }
  async checkViewportMeta(siteUrl) { return { status: 'good', present: true }; }
  async checkTouchElements(siteUrl) { return { status: 'good', properly_sized: true }; }
  async checkResponsiveImages(siteUrl) { return { status: 'good', optimized: true }; }
  async checkAMPPages(siteUrl) { return { status: 'good', amp_implemented: false }; }
  checkAltAttributes(content) { return { status: 'good', missing_count: 0 }; }
  checkOpenGraphTags(content) { return { status: 'good', complete: true }; }
  checkStructuredData(content) { return { status: true, types_found: ['Organization'] }; }
  checkOrganizationSchema(content) { return { status: 'good', present: true }; }
  checkBreadcrumbSchema(content) { return { status: 'warning', present: false }; }
  checkProductSchema(content) { return { status: 'warning', present: false }; }
  checkReviewSchema(content) { return { status: 'warning', present: false }; }
}
