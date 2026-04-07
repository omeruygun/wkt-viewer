using Microsoft.AspNetCore.Mvc;

namespace WktMapViewer.Controllers
{
    public class RobotsController : Controller
    {
        /// <summary>
        /// Dinamik robots.txt oluşturur
        /// </summary>
        [Route("robots.txt")]
        [ResponseCache(Duration = 86400)] // 1 gün cache
        public ContentResult Robots()
        {
            var sb = new System.Text.StringBuilder();
            
            // Genel arama motorları
            sb.AppendLine("# Genel Arama Motorları");
            sb.AppendLine("User-agent: *");
            sb.AppendLine("Allow: /");
            sb.AppendLine("Disallow: /bin/");
            sb.AppendLine("Disallow: /obj/");
            sb.AppendLine();
            
            // Google
            sb.AppendLine("# Google");
            sb.AppendLine("User-agent: Googlebot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Bing
            sb.AppendLine("# Bing");
            sb.AppendLine("User-agent: Bingbot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Yandex
            sb.AppendLine("# Yandex");
            sb.AppendLine("User-agent: Yandex");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // ========================================
            // AI Crawlers - İzin Ver
            // ========================================
            sb.AppendLine("# ========================================");
            sb.AppendLine("# AI Crawlers - İzin Verilen");
            sb.AppendLine("# ========================================");
            sb.AppendLine();
            
            // OpenAI - ChatGPT
            sb.AppendLine("# OpenAI ChatGPT");
            sb.AppendLine("User-agent: GPTBot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // OpenAI - SearchGPT
            sb.AppendLine("# OpenAI SearchGPT");
            sb.AppendLine("User-agent: OAI-SearchBot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Google AI (Gemini)
            sb.AppendLine("# Google AI / Gemini");
            sb.AppendLine("User-agent: Google-Extended");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Anthropic - Claude
            sb.AppendLine("# Anthropic Claude");
            sb.AppendLine("User-agent: anthropic-ai");
            sb.AppendLine("Allow: /");
            sb.AppendLine("User-agent: Claude-Web");
            sb.AppendLine("Allow: /");
            sb.AppendLine("User-agent: ClaudeBot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Microsoft Copilot
            sb.AppendLine("# Microsoft Copilot");
            sb.AppendLine("User-agent: Copilot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Perplexity AI
            sb.AppendLine("# Perplexity AI");
            sb.AppendLine("User-agent: PerplexityBot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Meta AI
            sb.AppendLine("# Meta AI");
            sb.AppendLine("User-agent: FacebookBot");
            sb.AppendLine("Allow: /");
            sb.AppendLine("User-agent: meta-externalagent");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Apple AI
            sb.AppendLine("# Apple AI");
            sb.AppendLine("User-agent: Applebot-Extended");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Cohere AI
            sb.AppendLine("# Cohere AI");
            sb.AppendLine("User-agent: cohere-ai");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Common Crawl (AI training datasets)
            sb.AppendLine("# Common Crawl");
            sb.AppendLine("User-agent: CCBot");
            sb.AppendLine("Allow: /");
            sb.AppendLine();
            
            // Sitemap
            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            sb.AppendLine("# Sitemap");
            sb.AppendLine($"Sitemap: {baseUrl}/sitemap.xml");
            sb.AppendLine();
            
            // LLMs.txt referansı
            sb.AppendLine("# AI/LLM Bilgi Dosyası");
            sb.AppendLine($"# LLMs.txt: {baseUrl}/llms.txt");

            return Content(sb.ToString(), "text/plain");
        }

        /// <summary>
        /// AI/LLM'ler için optimize edilmiş bilgi dosyası
        /// https://llmstxt.org/ standardına uygun
        /// </summary>
        [Route("llms.txt")]
        [ResponseCache(Duration = 86400)]
        public ContentResult LlmsTxt()
        {
            var sb = new System.Text.StringBuilder();
            
            sb.AppendLine("# Online WKT Viewer");
            sb.AppendLine();
            sb.AppendLine("> Online WKT Viewer, WKT (Well-Known Text) formatındaki geometrik verileri harita üzerinde görselleştirmek için kullanılan ücretsiz bir web uygulamasıdır.");
            sb.AppendLine();
            sb.AppendLine("## Özellikler");
            sb.AppendLine();
            sb.AppendLine("- WKT formatında geometri ekleme (Point, LineString, Polygon)");
            sb.AppendLine("- Harita üzerinde çizim araçları");
            sb.AppendLine("- Farklı projeksiyon sistemleri desteği (EPSG:4326, EPSG:3857, TM27-TM42)");
            sb.AppendLine("- Geometri stil düzenleme (renk, kalınlık, opaklık)");
            sb.AppendLine("- Projeksiyon dönüşümleri ve WKT çıktısı");
            sb.AppendLine("- Mobil uyumlu responsive tasarım");
            sb.AppendLine();
            sb.AppendLine("## Desteklenen Projeksiyon Sistemleri");
            sb.AppendLine();
            sb.AppendLine("- EPSG:4326 - WGS 84 (Derece)");
            sb.AppendLine("- EPSG:3857 - Web Mercator");
            sb.AppendLine("- TM 27, 30, 33, 36, 39, 42 - Türkiye Transverse Mercator");
            sb.AppendLine("- EPSG:2154 - Lambert 93 (Fransa)");
            sb.AppendLine("- EPSG:32632 - UTM Zone 32N");
            sb.AppendLine();
            sb.AppendLine("## Kullanım");
            sb.AppendLine();
            sb.AppendLine("1. 'WKT Ekle' butonuna tıklayın");
            sb.AppendLine("2. WKT string'inizi yapıştırın");
            sb.AppendLine("3. Kaynak projeksiyonu seçin");
            sb.AppendLine("4. Geometri haritada görüntülenir");
            sb.AppendLine();
            sb.AppendLine("## Teknolojiler");
            sb.AppendLine();
            sb.AppendLine("- ASP.NET Core 8.0");
            sb.AppendLine("- OpenLayers 4.6.5");
            sb.AppendLine("- Proj4js");
            sb.AppendLine();
            sb.AppendLine("## İletişim");
            sb.AppendLine();
            sb.AppendLine("Bu uygulama hakkında sorularınız için iletişime geçebilirsiniz.");

            return Content(sb.ToString(), "text/plain; charset=utf-8");
        }

        /// <summary>
        /// Basit sitemap.xml
        /// </summary>
        [Route("sitemap.xml")]
        [ResponseCache(Duration = 86400)]
        public ContentResult Sitemap()
        {
            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
            
            // Ana sayfa
            sb.AppendLine("  <url>");
            sb.AppendLine($"    <loc>{baseUrl}/</loc>");
            sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
            sb.AppendLine("    <changefreq>weekly</changefreq>");
            sb.AppendLine("    <priority>1.0</priority>");
            sb.AppendLine("  </url>");
            
            sb.AppendLine("</urlset>");

            return Content(sb.ToString(), "application/xml; charset=utf-8");
        }
    }
}
