export const blogCategories:string[] = [
    'All',
    'Technology',
    'Science',
    'Programming',
    'Web Development',
    'Design',
    'Travel',
    'Nature',
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
    technology:"https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D",
    fitness:"https://images.unsplash.com/photo-1613685044678-0a9ae422cf5a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D",
    food:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGZvb2R8ZW58MHx8MHx8fDA%3D",
    travel:"https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsfGVufDB8fDB8fHww",
    health:"https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2596&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    nature:"https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
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
  catImageMap.set("fitness",catImages.fitness);
  catImageMap.set("health",catImages.health);
  catImageMap.set("travel",catImages.travel);
  catImageMap.set("food",catImages.food);


export  const categories = [
    {
      name:"technology",
      img:catImages.technology
    },
    {
      name:"fitness",
      img:catImages.fitness
    },
    {
      name:"food",
      img:catImages.food
    },
    {
        name:"travel",
        img:catImages.travel
    },
    {
      name:"nature",
      img:catImages.nature
    },
    {
      name:"health",
      img:catImages.health
    }
  ]