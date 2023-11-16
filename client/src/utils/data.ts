export const blogCategories:string[] = [
    'All',
    'Technology',
    'Science',
    'Programming',
    'Web Development',
    'Design',
    'Travel',
    'Food',
    'Health',
    'Fitness',
    'Lifestyle',
    'Finance',
    'Business',
    'Entertainment',
    'Books',
    'Movies',
    'Music',
    'Sports',
    'Education',
    'Art',
    'Photography',
    'Fashion',
    'Beauty',
    'DIY',
    'Home Decor',
    'Gardening',
    'Parenting',
    'Pets',
    'Relationships',
    'Self Improvement',
    'Motivation',
  ];
  


  export const catImages = {
    technology:"https://wallpaperaccess.com/full/266471.jpg",
    fitness:"https://c4.wallpaperflare.com/wallpaper/206/268/839/pose-muscle-muscle-rod-press-hd-wallpaper-preview.jpg",
    food:"https://thumbs.dreamstime.com/b/balanced-diet-food-background-balanced-diet-food-background-organic-food-healthy-nutrition-superfoods-meat-fish-legumes-nuts-121936796.jpg",
    travel:"https://png.pngtree.com/background/20230401/original/pngtree-travel-around-the-world-background-picture-image_2253108.jpg",
    health:"https://e0.pxfuel.com/wallpapers/319/181/desktop-wallpaper-health-care-medical-care.jpg",
    nature:"https://www.hdwallpapers.in/download/green_leaves_in_blur_green_background_hd_nature-1366x768.jpg",
  }
  export const catThumbnailImages = {
    technology:"https://wallpaperaccess.com/full/266471.jpg",
    fitness:"https://c4.wallpaperflare.com/wallpaper/206/268/839/pose-muscle-muscle-rod-press-hd-wallpaper-preview.jpg",
    food:"https://thumbs.dreamstime.com/b/balanced-diet-food-background-balanced-diet-food-background-organic-food-healthy-nutrition-superfoods-meat-fish-legumes-nuts-121936796.jpg",
    travel:"https://png.pngtree.com/background/20230401/original/pngtree-travel-around-the-world-background-picture-image_2253108.jpg",
    health:"https://e0.pxfuel.com/wallpapers/319/181/desktop-wallpaper-health-care-medical-care.jpg",
    nature:"https://www.hdwallpapers.in/download/green_leaves_in_blur_green_background_hd_nature-1366x768.jpg",
  }
  
  export const catImageMap = new Map<string,string>();


  catImageMap.set("technology",catImages.technology);
  catImageMap.set("nature",catImages.nature);
  catImageMap.set("fitnesss",catImages.fitness);
  catImageMap.set("health",catImages.health);
  catImageMap.set("travel",catImages.travel);
  catImageMap.set("food",catImages.food);