using Microsoft.AspNetCore.Mvc;

namespace WktMapViewer.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Title"] = "WKT Harita Görüntüleyici";
            return View();
        }
    }
}
