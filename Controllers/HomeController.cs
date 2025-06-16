using Microsoft.AspNetCore.Mvc;
using ScratchCardGame.Models;

namespace ScratchCardGame.Controllers
{
    public class HomeController : Controller
    {
        private static readonly string[] Prizes = 
        {
            "🎁 一等奖 - 10000元",
            "🏆 二等奖 - 5000元", 
            "🎊 三等奖 - 1000元",
            "🍀 幸运奖 - 500元",
            "💰 现金奖 - 100元",
            "🎈 安慰奖 - 50元",
            "🎯 特别奖 - 2000元",
            "⭐ 星级奖 - 800元"
        };

        private static readonly string[] PrizeColors = 
        {
            "#FFD700", // Gold
            "#C0C0C0", // Silver  
            "#CD7F32", // Bronze
            "#90EE90", // LightGreen
            "#87CEEB", // SkyBlue
            "#FFB6C1", // LightPink
            "#DDA0DD", // Plum
            "#F0E68C"  // Khaki
        };

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetNewPrize()
        {
            var random = new Random();
            var index = random.Next(Prizes.Length);
            
            var result = new PrizeResult
            {
                Prize = Prizes[index],
                Color = PrizeColors[index],
                Success = true
            };

            return Json(result);
        }
    }
}