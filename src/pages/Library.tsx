import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Search, Star, ChevronDown, X, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categories = ["All", "Nutrition", "Mental Health", "Hygiene", "Fitness", "Sleep", "Education", "Environment", "Community", "Health Equity"];
const catColors: Record<string, string> = {
  Nutrition: "bg-success/20 text-success",
  "Mental Health": "bg-info/20 text-info",
  Hygiene: "bg-warning/20 text-warning",
  Fitness: "bg-primary/20 text-primary",
  Sleep: "bg-accent text-accent-foreground",
  Education: "bg-purple-500/20 text-purple-500",
  Environment: "bg-green-500/20 text-green-500",
  Community: "bg-orange-500/20 text-orange-500",
  "Health Equity": "bg-pink-500/20 text-pink-500",
};

const categoryExpansion: Record<string, string> = {
  Nutrition: "This article continues by breaking down actionable planning, meal combos, and how to build a sustainable eating pattern that supports good health without adding unnecessary stress.",
  "Mental Health": "Continue reading for guided exercises, support strategies, and real-world examples that help you build resilience, manage stress, and stay grounded during challenging days.",
  Hygiene: "The next section dives deeper into practical daily routines, common hygiene myths, and easy, affordable habits that protect you and your community from illness.",
  Fitness: "You’ll also find movement plans that fit into busy schedules, recovery tips, and ways to stay motivated over time while avoiding common injuries.",
  Sleep: "Later sections include evening routines, environment changes, and habits that encourage more restful sleep for better energy and immune health.",
  Education: "This article then explores learning methods, resource selection, and how to keep growing your skills even when life gets busy.",
  Environment: "The piece expands into how simple choices affect both human health and the planet, with practical steps to make a real difference where you live.",
  Community: "The final sections explore collaboration, leadership, and ways to turn individual effort into stronger support networks for everyone.",
  "Health Equity": "You’ll also learn about structural issues, the role of advocacy, and how volunteers can help improve access to care in underserved communities.",
};

const getExpandedArticleContent = (article: typeof articles[number]) => {
  const extra = categoryExpansion[article.category] || "This article expands with practical advice, deeper context, and real-world examples that help you act on what you learn.";
  return `${article.content}\n\n${extra}\n\nThe final section brings the ideas together with a clear summary, action steps, and tips for making long-term progress in this area.`;
};

// Comprehensive collection of 120+ articles on social impact topics
const articles = [
  // Nutrition (15 articles)
  { emoji: "🥗", title: "10 Superfoods for Immunity", category: "Nutrition", recommended: true, readTime: "5 min", 
    desc: "Boost your immune system with these nutrient-packed foods backed by science.",
    source: "Harvard School of Public Health",
    sourceUrl: "https://www.hsph.harvard.edu",
    content: "Superfoods are nutrient-rich foods that offer exceptional health benefits. This comprehensive guide explores 10 immunity-boosting superfoods including berries, leafy greens, nuts, and fermented foods. Learn about their nutritional profiles, scientific backing, and practical ways to incorporate them into your daily diet for maximum health impact." },
  { emoji: "🍎", title: "Meal Prep for Busy Students", category: "Nutrition", recommended: false, readTime: "7 min",
    desc: "Quick and healthy meal prep ideas that fit a student budget.",
    source: "BBC Good Food",
    sourceUrl: "https://www.bbcgoodfood.com",
    content: "Time management and nutrition often conflict for students. This guide provides practical meal prep strategies that are both healthy and budget-friendly. Learn batch cooking techniques, storage tips, and recipes that can be prepared in under 30 minutes per week." },
  { emoji: "🌱", title: "Plant-Based Nutrition for Beginners", category: "Nutrition", recommended: true, readTime: "8 min",
    desc: "Transitioning to a plant-based diet for better health and environmental impact.",
    source: "The Vegan Society",
    sourceUrl: "https://www.vegansociety.com",
    content: "Plant-based eating offers numerous health and environmental benefits. This beginner's guide covers essential nutrients, meal planning, and common misconceptions. Discover how to maintain optimal nutrition while reducing your carbon footprint through conscious food choices." },
  { emoji: "🥤", title: "Hydration Science: Beyond 8 Glasses", category: "Nutrition", recommended: false, readTime: "6 min",
    desc: "Understanding your body's hydration needs and optimal fluid intake.",
    source: "Mayo Clinic",
    sourceUrl: "https://www.mayoclinic.org",
    content: "Proper hydration is crucial for health but varies by individual. Learn about the science behind hydration, signs of dehydration, and how to calculate your personal daily water needs based on activity level, climate, and health conditions." },
  { emoji: "🫘", title: "Protein Sources for Vegetarians", category: "Nutrition", recommended: false, readTime: "5 min",
    desc: "Complete protein combinations and sources for plant-based diets.",
    source: "Nutrition Stripped",
    sourceUrl: "https://www.nutritionstripped.com",
    content: "Protein is essential for muscle repair and overall health. This guide explores complete protein sources for vegetarians, including legumes, grains, nuts, and seeds. Learn about complementary proteins and meal planning for optimal nutrition." },
  { emoji: "🧄", title: "Anti-Inflammatory Foods Guide", category: "Nutrition", recommended: true, readTime: "9 min",
    desc: "Foods that reduce inflammation and support long-term health.",
    source: "Cleveland Clinic",
    sourceUrl: "https://health.clevelandclinic.org",
    content: "Chronic inflammation contributes to many diseases. Discover the most effective anti-inflammatory foods including fatty fish, colorful vegetables, herbs, and spices. Learn about the science behind their benefits and how to incorporate them into your diet." },
  { emoji: "🥑", title: "Healthy Fats: The Complete Guide", category: "Nutrition", recommended: false, readTime: "7 min",
    desc: "Understanding healthy vs unhealthy fats and their role in nutrition.",
    source: "Healthline",
    sourceUrl: "https://www.healthline.com",
    content: "Not all fats are created equal. This comprehensive guide distinguishes between healthy and unhealthy fats, explaining their roles in heart health, brain function, and hormone production. Learn which fats to prioritize and which to avoid." },
  { emoji: "🍽️", title: "Mindful Eating for Better Health", category: "Nutrition", recommended: false, readTime: "6 min",
    desc: "How to eat with intention and improve your relationship with food.",
    source: "Center for Mindful Eating",
    sourceUrl: "https://www.tcme.org",
    content: "Mindful eating can transform your relationship with food and improve digestion. Learn practical techniques for eating with awareness, recognizing hunger cues, and enjoying meals without distraction. Discover how this practice supports both physical and mental health." },
  { emoji: "🥕", title: "Seasonal Eating Benefits", category: "Nutrition", recommended: false, readTime: "4 min",
    desc: "Why eating seasonally supports health and sustainability.",
    source: "Eat Well Guide",
    sourceUrl: "https://www.eatwellguide.org",
    content: "Seasonal eating offers nutritional and environmental benefits. Learn about nutrient density variations throughout the year, cost savings, and environmental impact. Discover how to identify in-season produce and plan meals accordingly." },
  { emoji: "🧀", title: "Calcium Sources Beyond Dairy", category: "Nutrition", recommended: false, readTime: "5 min",
    desc: "Plant-based and fortified sources of calcium for bone health.",
    source: "Harvard Health Publishing",
    sourceUrl: "https://www.health.harvard.edu",
    content: "Calcium is essential for bone health but dairy isn't the only source. Explore plant-based calcium sources including leafy greens, fortified foods, and supplements. Learn about absorption rates and how to meet calcium needs on various diets." },
  { emoji: "🍓", title: "Antioxidants & Free Radical Defense", category: "Nutrition", recommended: true, readTime: "7 min",
    desc: "Understanding oxidative stress and foods that fight aging.",
    source: "National Institutes of Health",
    sourceUrl: "https://www.nih.gov",
    content: "Antioxidants protect cells from damage caused by free radicals. Learn which foods are richest in antioxidants, how they work at the cellular level, and their role in preventing chronic disease and slowing aging." },
  { emoji: "🌾", title: "Whole Grains vs Refined Carbs", category: "Nutrition", recommended: true, readTime: "6 min",
    desc: "Why whole grains matter for sustained energy and health.",
    source: "American Heart Association",
    sourceUrl: "https://www.heart.org",
    content: "The difference between whole and refined grains significantly impacts health. Understand glycemic index, nutrient retention, and how to make grains a cornerstone of healthy eating." },
  { emoji: "🍯", title: "Sugar & Natural Sweeteners", category: "Nutrition", recommended: false, readTime: "6 min",
    desc: "Making informed choices about sweetness in your diet.",
    source: "American Diabetes Association",
    sourceUrl: "https://www.diabetes.org",
    content: "Sugar impacts health in multiple ways. Learn about added sugars, natural sweeteners, and how to reduce consumption gradually while satisfying sweet cravings." },
  { emoji: "🥦", title: "Cruciferous Vegetables Power", category: "Nutrition", recommended: false, readTime: "5 min",
    desc: "Broccoli, cauliflower, and their cancer-fighting compounds.",
    source: "Memorial Sloan Kettering Cancer Center",
    sourceUrl: "https://www.mskcc.org",
    content: "Cruciferous vegetables contain sulforaphane and other compounds linked to health benefits. Discover preparation methods that maximize their nutritional power." },
  { emoji: "🍡", title: "Portion Control & Satiety", category: "Nutrition", recommended: false, readTime: "5 min",
    desc: "Eating right amounts without constantly thinking about food.",
    source: "USDA Center for Nutrition Policy",
    sourceUrl: "https://www.cnpp.usda.gov",
    content: "Portion control becomes easier when you understand satiety signals. Learn strategies for satisfying hunger with appropriate amounts of nutrient-dense foods." },

  // Mental Health (12 articles)
  { emoji: "🧠", title: "Mindfulness for Beginners", category: "Mental Health", recommended: true, readTime: "8 min",
    desc: "Simple meditation techniques to reduce stress and improve focus.",
    source: "Mindfulness Training Institute",
    sourceUrl: "https://www.mindfulnesstraininginstitute.com",
    content: "Mindfulness meditation offers powerful benefits for mental health. This beginner's guide covers basic techniques, breathing exercises, and daily practices. Learn how to establish a meditation routine and integrate mindfulness into your busy schedule." },
  { emoji: "🧘", title: "Managing Compassion Fatigue", category: "Mental Health", recommended: true, readTime: "10 min",
    desc: "How to recognize and cope with emotional burnout in volunteer work.",
    source: "American Psychological Association",
    sourceUrl: "https://www.apa.org",
    content: "Compassion fatigue affects many volunteers and caregivers. Learn to recognize symptoms, understand contributing factors, and implement self-care strategies. Discover organizational support systems and personal boundaries that prevent burnout." },
  { emoji: "💭", title: "Cognitive Behavioral Techniques", category: "Mental Health", recommended: false, readTime: "12 min",
    desc: "Practical CBT methods for managing negative thought patterns.",
    source: "Beck Institute",
    sourceUrl: "https://beckinstitute.org",
    content: "Cognitive Behavioral Therapy offers effective tools for mental health. Learn core CBT techniques including thought challenging, behavioral activation, and cognitive restructuring. Discover how to apply these methods to common mental health concerns." },
  { emoji: "🤝", title: "Building Emotional Resilience", category: "Mental Health", recommended: true, readTime: "9 min",
    desc: "Strategies for developing mental toughness and adaptability.",
    source: "Greater Good Science Center",
    sourceUrl: "https://greatergood.berkeley.edu",
    content: "Emotional resilience helps navigate life's challenges. Learn about protective factors, coping strategies, and resilience-building exercises. Discover how to cultivate mental toughness while maintaining empathy and compassion." },
  { emoji: "😴", title: "Sleep and Mental Health Connection", category: "Mental Health", recommended: false, readTime: "7 min",
    desc: "How quality sleep supports emotional well-being and cognitive function.",
    source: "Sleep Foundation",
    sourceUrl: "https://www.sleepfoundation.org",
    content: "Sleep and mental health are deeply interconnected. Understand the bidirectional relationship between sleep quality and emotional health. Learn sleep hygiene practices that support mental wellness and recognize when professional help is needed." },
  { emoji: "📱", title: "Digital Wellness for Mental Health", category: "Mental Health", recommended: false, readTime: "6 min",
    desc: "Managing screen time and online interactions for better mental health.",
    source: "Common Sense Media",
    sourceUrl: "https://www.commonsensemedia.org",
    content: "Digital technology impacts mental health in complex ways. Learn about screen time management, social media effects, and digital detox strategies. Discover how to maintain healthy online relationships while protecting your mental well-being." },
  { emoji: "🎯", title: "Goal Setting for Mental Wellness", category: "Mental Health", recommended: false, readTime: "5 min",
    desc: "SMART goals that support mental health and personal growth.",
    source: "Psychology Today",
    sourceUrl: "https://www.psychologytoday.com",
    content: "Effective goal setting supports mental health and motivation. Learn SMART goal framework, mental health considerations, and progress tracking. Discover how to set achievable goals that promote well-being rather than stress." },
  { emoji: "🌱", title: "Growth Mindset Development", category: "Mental Health", recommended: false, readTime: "8 min",
    desc: "Cultivating a growth mindset for resilience and learning.",
    source: "Mindset Works",
    sourceUrl: "https://www.mindsetworks.com",
    content: "Growth mindset transforms challenges into opportunities. Learn the difference between fixed and growth mindsets, practical development strategies, and applications in volunteer work. Discover how this mindset supports long-term mental health." },
  { emoji: "🎨", title: "Art Therapy & Creative Expression", category: "Mental Health", recommended: true, readTime: "7 min",
    desc: "How creative activities support emotional processing and healing.",
    source: "American Art Therapy Association",
    sourceUrl: "https://www.arttherapy.org",
    content: "Creative expression through art, music, or writing provides therapeutic benefits. Explore how creativity activates different brain regions and supports emotional regulation." },
  { emoji: "🌳", title: "Nature & Green Space Therapy", category: "Mental Health", recommended: false, readTime: "6 min",
    desc: "Why time in nature significantly improves mental wellbeing.",
    source: "Children & Nature Network",
    sourceUrl: "https://www.childrenandnature.org",
    content: "Nature exposure reduces stress hormones and improves mood. Learn about biophilia, forest bathing, and how to incorporate green spaces into urban living." },
  { emoji: "🎵", title: "Music Therapy Benefits", category: "Mental Health", recommended: false, readTime: "5 min",
    desc: "How music influences mood, memory, and emotional regulation.",
    source: "American Music Therapy Association",
    sourceUrl: "https://www.musictherapy.org",
    content: "Music affects brain chemistry and emotional states. Discover which types of music support different mental health outcomes and how to build a therapeutic playlist." },
  { emoji: "📚", title: "Reading & Literature for Emotional Growth", category: "Mental Health", recommended: false, readTime: "6 min",
    desc: "Bibliotherapy and finding yourself through stories.",
    source: "Poets & Writers",
    sourceUrl: "https://www.pw.org",
    content: "Reading offers escapism, perspective, and emotional processing. Explore how literature addresses universal human experiences and promotes empathy." },

  // Hygiene (10 articles)
  { emoji: "🧴", title: "Hand Hygiene Best Practices", category: "Hygiene", recommended: false, readTime: "3 min",
    desc: "The WHO-recommended hand washing technique explained step by step.",
    source: "World Health Organization",
    sourceUrl: "https://www.who.int",
    content: "Proper hand hygiene prevents disease transmission. Learn the WHO's 6-step hand washing technique, when to wash hands, and effective alternatives when soap and water aren't available. Understand the science behind hand hygiene effectiveness." },
  { emoji: "🚿", title: "Personal Hygiene Routines", category: "Hygiene", recommended: false, readTime: "6 min",
    desc: "Comprehensive daily hygiene practices for health and confidence.",
    source: "Centers for Disease Control",
    sourceUrl: "https://www.cdc.gov",
    content: "Good personal hygiene supports health and social interactions. Learn about bathing, oral care, and grooming routines. Discover how consistent hygiene practices prevent infections and promote overall well-being." },
  { emoji: "🏠", title: "Home Cleaning for Health", category: "Hygiene", recommended: false, readTime: "7 min",
    desc: "Effective cleaning methods to maintain a healthy living environment.",
    source: "Environmental Protection Agency",
    sourceUrl: "https://www.epa.gov",
    content: "Home environment affects health and well-being. Learn targeted cleaning strategies for high-touch surfaces, kitchen, bathroom, and living areas. Discover natural cleaning alternatives and frequency guidelines for optimal hygiene." },
  { emoji: "👕", title: "Clothing and Textile Care", category: "Hygiene", recommended: false, readTime: "4 min",
    desc: "Maintaining clean and hygienic clothing and fabrics.",
    source: "Mayo Clinic",
    sourceUrl: "https://www.mayoclinic.org",
    content: "Clothing hygiene prevents skin infections and odors. Learn about laundry best practices, fabric care, and storage methods. Discover how to maintain hygienic textiles while being environmentally conscious." },
  { emoji: "🍽️", title: "Food Safety and Kitchen Hygiene", category: "Hygiene", recommended: false, readTime: "8 min",
    desc: "Preventing foodborne illnesses through proper kitchen practices.",
    source: "Food and Drug Administration",
    sourceUrl: "https://www.fda.gov",
    content: "Food safety protects against illness and supports community health. Learn cross-contamination prevention, temperature control, and cleaning procedures. Discover how proper kitchen hygiene benefits both individual and community health." },
  { emoji: "🌿", title: "Natural Hygiene Products", category: "Hygiene", recommended: false, readTime: "5 min",
    desc: "Effective natural alternatives to commercial hygiene products.",
    source: "Environmental Working Group",
    sourceUrl: "https://www.ewg.org",
    content: "Natural hygiene products can be effective and eco-friendly. Learn about plant-based soaps, essential oils, and homemade cleaning solutions. Discover how to choose safe, effective natural alternatives for personal and home hygiene." },
  { emoji: "🪥", title: "Dental Hygiene Fundamentals", category: "Hygiene", recommended: true, readTime: "4 min",
    desc: "Brushing, flossing, and maintaining optimal oral health.",
    source: "American Dental Association",
    sourceUrl: "https://www.ada.org",
    content: "Dental hygiene prevents cavities and gum disease. Learn proper technique, frequency, and products that support oral health and systemic wellbeing." },
  { emoji: "👃", title: "Respiratory Hygiene", category: "Hygiene", recommended: false, readTime: "4 min",
    desc: "Preventing respiratory infections through proper practices.",
    source: "World Health Organization",
    sourceUrl: "https://www.who.int",
    content: "Respiratory hygiene protects you and others. Learn coughing etiquette, mask use, and ventilation principles." },
  { emoji: "💇", title: "Hair and Scalp Care", category: "Hygiene", recommended: false, readTime: "5 min",
    desc: "Maintaining healthy hair through proper cleansing and care.",
    source: "American Academy of Dermatology",
    sourceUrl: "https://www.aad.org",
    content: "Scalp health supports hair growth. Learn about different hair types and appropriate care routines." },
  { emoji: "👣", title: "Foot Hygiene & Prevention", category: "Hygiene", recommended: false, readTime: "4 min",
    desc: "Preventing fungal infections and foot problems.",
    source: "American Podiatric Medical Association",
    sourceUrl: "https://www.apma.org",
    content: "Feet deserve attention. Learn daily care, shoe selection, and when to seek professional help." },

  // Fitness (12 articles)
  { emoji: "🏃", title: "15-Minute HIIT Routine", category: "Fitness", recommended: true, readTime: "4 min",
    desc: "High-intensity interval training you can do anywhere, no equipment needed.",
    source: "American Council on Exercise",
    sourceUrl: "https://www.acefitness.org",
    content: "HIIT offers efficient cardiovascular and strength benefits. Learn a complete 15-minute routine with proper form, modifications, and safety considerations. Discover how to incorporate HIIT into a busy schedule for maximum health impact." },
  { emoji: "💪", title: "Desk Stretches for Volunteers", category: "Fitness", recommended: false, readTime: "3 min",
    desc: "Prevent back pain and stiffness with these simple stretches.",
    source: "Mayo Clinic",
    sourceUrl: "https://www.mayoclinic.org",
    content: "Sedentary work causes musculoskeletal issues. Learn targeted stretches for neck, shoulders, back, and wrists. Discover how to integrate stretching into work routines and prevent chronic pain from prolonged sitting." },
  { emoji: "🚶", title: "Walking for Health and Impact", category: "Fitness", recommended: false, readTime: "5 min",
    desc: "How daily walking supports physical health and environmental consciousness.",
    source: "American Heart Association",
    sourceUrl: "https://www.heart.org",
    content: "Walking is accessible exercise with broad benefits. Learn about cardiovascular health, mental wellness, and environmental impact. Discover walking programs, tracking methods, and how to make walking a sustainable habit." },
  { emoji: "🧘", title: "Yoga for Stress Relief", category: "Fitness", recommended: false, readTime: "6 min",
    desc: "Gentle yoga poses and sequences for relaxation and flexibility.",
    source: "Yoga Alliance",
    sourceUrl: "https://www.yogaalliance.org",
    content: "Yoga combines physical and mental health benefits. Learn beginner-friendly poses, breathing techniques, and sequences for stress relief. Discover how yoga supports both physical flexibility and emotional resilience." },
  { emoji: "🏋️", title: "Strength Training Basics", category: "Fitness", recommended: false, readTime: "9 min",
    desc: "Building muscle and bone density with proper form and progression.",
    source: "National Strength and Conditioning Association",
    sourceUrl: "https://www.nsca.com",
    content: "Strength training supports metabolism and bone health. Learn fundamental exercises, proper form, and progression principles. Discover how to create effective strength programs with minimal equipment." },
  { emoji: "🤸", title: "Functional Movement Patterns", category: "Fitness", recommended: false, readTime: "7 min",
    desc: "Exercises that improve daily movement quality and prevent injury.",
    source: "International Sports Sciences Association",
    sourceUrl: "https://www.issaonline.com",
    content: "Functional fitness supports daily activities and longevity. Learn key movement patterns including squatting, pushing, pulling, and rotation. Discover how functional training prevents injury and improves quality of life." },
  { emoji: "🚴", title: "Cycling as Cardio & Transport", category: "Fitness", recommended: true, readTime: "6 min",
    desc: "Building fitness while reducing environmental impact.",
    source: "League of American Bicyclists",
    sourceUrl: "https://www.bikeleague.org",
    content: "Cycling strengthens heart and legs. Learn bike selection, safety, and how to incorporate cycling into daily routines." },
  { emoji: "🏊", title: "Swimming for Full-Body Fitness", category: "Fitness", recommended: true, readTime: "7 min",
    desc: "Low-impact water exercise that strengthens all muscle groups.",
    source: "USA Swimming",
    sourceUrl: "https://www.usaswimming.org",
    content: "Swimming provides cardio while reducing joint stress. Explore techniques for all fitness levels and water safety." },
  { emoji: "⛹️", title: "Sports for Cardiovascular Health", category: "Fitness", recommended: false, readTime: "5 min",
    desc: "Fun team sports that build endurance and community.",
    source: "American College of Sports Medicine",
    sourceUrl: "https://www.acsm.org",
    content: "Sports combine exercise with social connection. Explore various sports and their health benefits." },
  { emoji: "🧗", title: "Rock Climbing & Adventure Fitness", category: "Fitness", recommended: false, readTime: "6 min",
    desc: "Challenge yourself with climbing for strength and problem-solving.",
    source: "Access Fund",
    sourceUrl: "https://www.accessfund.org",
    content: "Climbing builds strength while engaging the mind. Learn indoor and outdoor climbing safely." },
  { emoji: "🪂", title: "Adventure Sports & Wellness", category: "Fitness", recommended: false, readTime: "6 min",
    desc: "Pushing boundaries while maintaining physical and mental health.",
    source: "Outdoor Foundation",
    sourceUrl: "https://www.outdoorfoundation.org",
    content: "Adventure activities build confidence and resilience. Explore options appropriate to your fitness level." },
  { emoji: "🤾", title: "Dance as Exercise", category: "Fitness", recommended: true, readTime: "5 min",
    desc: "Moving to music for fitness, expression, and joy.",
    source: "Dance/USA",
    sourceUrl: "https://www.danceusa.org",
    content: "Dance combines cardio with emotional expression. Learn various dance styles and their benefits." },

  // Sleep (8 articles)
  { emoji: "😴", title: "Sleep Hygiene 101", category: "Sleep", recommended: false, readTime: "6 min",
    desc: "Evidence-based tips for better sleep quality and consistency.",
    source: "Sleep Foundation",
    sourceUrl: "https://www.sleepfoundation.org",
    content: "Sleep hygiene affects health and performance. Learn about optimal sleep environment, routines, and habits. Discover evidence-based strategies for improving sleep quality and addressing common sleep issues." },
  { emoji: "🌙", title: "Circadian Rhythm Optimization", category: "Sleep", recommended: false, readTime: "8 min",
    desc: "Aligning your schedule with natural light-dark cycles for better health.",
    source: "National Institute of General Medical Sciences",
    sourceUrl: "https://www.nigms.nih.gov",
    content: "Circadian rhythms regulate sleep and many bodily functions. Learn about light exposure, meal timing, and activity scheduling. Discover how to optimize your daily rhythm for better sleep, energy, and health." },
  { emoji: "📱", title: "Digital Detox Before Bed", category: "Sleep", recommended: false, readTime: "4 min",
    desc: "Reducing screen time and blue light exposure for better sleep.",
    source: "American Academy of Sleep Medicine",
    sourceUrl: "https://aasm.org",
    content: "Blue light disrupts sleep hormones and quality. Learn about blue light effects, optimal screen curfews, and alternatives. Discover practical strategies for digital detox that improve sleep and daytime alertness." },
  { emoji: "🎵", title: "Sleep-Inducing Techniques", category: "Sleep", recommended: false, readTime: "5 min",
    desc: "Relaxation methods and routines to fall asleep faster and stay asleep.",
    source: "Psychology Today",
    sourceUrl: "https://www.psychologytoday.com",
    content: "Sleep onset can be challenging for many people. Learn progressive muscle relaxation, visualization, and breathing techniques. Discover comprehensive sleep routines that address both body and mind for restful sleep." },
  { emoji: "🛏️", title: "Bedding & Sleep Environment", category: "Sleep", recommended: true, readTime: "6 min",
    desc: "Creating the perfect sleep sanctuary at home.",
    source: "Better Sleep Council",
    sourceUrl: "https://www.bettersleep.org",
    content: "Your bedroom environment directly impacts sleep quality. Learn about temperature, bedding materials, and darkness levels." },
  { emoji: "☕", title: "Caffeine & Sleep Management", category: "Sleep", recommended: false, readTime: "4 min",
    desc: "Understanding how caffeine affects sleep cycles.",
    source: "Mayo Clinic",
    sourceUrl: "https://www.mayoclinic.org",
    content: "Caffeine timing matters for good sleep. Learn half-lives, sources, and alternatives." },
  { emoji: "💤", title: "Dealing with Insomnia", category: "Sleep", recommended: true, readTime: "7 min",
    desc: "Practical strategies for chronic sleep problems.",
    source: "American Academy of Sleep Medicine",
    sourceUrl: "https://aasm.org",
    content: "Insomnia has multiple causes and treatments. Learn cognitive approaches and when to seek professional help." },
  { emoji: "🌍", title: "Sleep Across Time Zones", category: "Sleep", recommended: false, readTime: "5 min",
    desc: "Managing jet lag and maintaining sleep while traveling.",
    source: "CDC Travel Health",
    sourceUrl: "https://wwwnc.cdc.gov/travel",
    content: "Travel disrupts circadian rhythms. Learn timing strategies for light exposure and melatonin." },

  // Education (10 articles)
  { emoji: "📚", title: "Lifelong Learning Strategies", category: "Education", recommended: true, readTime: "7 min",
    desc: "Developing habits for continuous personal and professional growth.",
    source: "UNESCO Institute for Lifelong Learning",
    sourceUrl: "https://uil.unesco.org",
    content: "Lifelong learning supports career and personal development. Learn effective study techniques, resource identification, and habit formation. Discover how to integrate learning into busy schedules while maintaining work-life balance." },
  { emoji: "🎓", title: "Volunteer Skill Development", category: "Education", recommended: false, readTime: "6 min",
    desc: "Building valuable skills through volunteer work and community service.",
    source: "VolunteerMatch",
    sourceUrl: "https://www.volunteermatch.org",
    content: "Volunteering offers skill development opportunities. Learn about leadership, communication, and specialized skills gained through service. Discover how to maximize learning while making community impact." },
  { emoji: "🌐", title: "Online Learning Resources", category: "Education", recommended: false, readTime: "5 min",
    desc: "Free and accessible educational platforms for skill development.",
    source: "edX",
    sourceUrl: "https://www.edx.org",
    content: "Online learning democratizes education access. Explore free platforms, course quality assessment, and effective learning strategies. Discover how to build comprehensive skill sets through accessible online resources." },
  { emoji: "👨‍🏫", title: "Teaching and Mentoring Skills", category: "Education", recommended: false, readTime: "8 min",
    desc: "Developing teaching abilities to share knowledge and empower others.",
    source: "Teach For America",
    sourceUrl: "https://www.teachforamerica.org",
    content: "Teaching skills benefit both educators and learners. Learn communication techniques, feedback methods, and engagement strategies. Discover how to create effective learning experiences that empower others." },
  { emoji: "📖", title: "Reading for Personal Growth", category: "Education", recommended: false, readTime: "4 min",
    desc: "Building a reading habit that expands knowledge and perspective.",
    source: "Reading Is Fundamental",
    sourceUrl: "https://www.rif.org",
    content: "Reading broadens understanding and empathy. Learn about diverse genres, reading techniques, and habit formation. Discover how to integrate reading into daily life for continuous personal development." },
  { emoji: "🧩", title: "Problem-Solving & Critical Thinking", category: "Education", recommended: true, readTime: "7 min",
    desc: "Developing analytical skills for complex challenges.",
    source: "Foundation for Critical Thinking",
    sourceUrl: "https://www.criticalthinking.org",
    content: "Critical thinking improves decision-making. Learn frameworks for analyzing problems and generating solutions." },
  { emoji: "💼", title: "Professional Development & Certification", category: "Education", recommended: false, readTime: "6 min",
    desc: "Advancing career through credentials and continuous learning.",
    source: "LinkedIn Learning",
    sourceUrl: "https://www.linkedin.com/learning",
    content: "Professional development opens opportunities. Explore certifications relevant to volunteer and social impact work." },
  { emoji: "🗣️", title: "Communication & Public Speaking", category: "Education", recommended: true, readTime: "6 min",
    desc: "Expressing ideas effectively and building confidence.",
    source: "Toastmasters International",
    sourceUrl: "https://www.toastmasters.org",
    content: "Communication skills are essential for leadership. Learn techniques to overcome anxiety and present clearly." },
  { emoji: "🎯", title: "Learning Style Optimization", category: "Education", recommended: false, readTime: "5 min",
    desc: "Understanding how you learn best to maximize retention.",
    source: "VARK Learn",
    sourceUrl: "https://vark-learn.com",
    content: "Different people learn differently. Discover your learning style and adapt study methods accordingly." },
  { emoji: "📝", title: "Note-Taking Strategies", category: "Education", recommended: false, readTime: "4 min",
    desc: "Capturing and retaining information effectively.",
    source: "Cornell University",
    sourceUrl: "https://www.cornell.edu",
    content: "Good note-taking improves learning. Learn various techniques from Cornell method to mind mapping." },

  // Environment (8 articles)
  { emoji: "🌱", title: "Sustainable Living Practices", category: "Environment", recommended: true, readTime: "9 min",
    desc: "Practical steps for reducing environmental impact in daily life.",
    source: "Environmental Protection Agency",
    sourceUrl: "https://www.epa.gov",
    content: "Individual actions contribute to environmental health. Learn about waste reduction, energy conservation, and sustainable consumption. Discover comprehensive strategies for minimizing ecological footprint while maintaining quality of life." },
  { emoji: "♻️", title: "Zero Waste Lifestyle", category: "Environment", recommended: false, readTime: "7 min",
    desc: "Eliminating waste through conscious consumption and waste management.",
    source: "Zero Waste International Alliance",
    sourceUrl: "https://zwia.org",
    content: "Zero waste challenges consumption patterns and waste generation. Learn about waste hierarchy, product selection, and waste diversion. Discover practical strategies for reducing environmental impact through mindful consumption." },
  { emoji: "🌳", title: "Urban Gardening Basics", category: "Environment", recommended: false, readTime: "6 min",
    desc: "Growing food in limited spaces to promote sustainability and health.",
    source: "American Community Gardening Association",
    sourceUrl: "https://communitygarden.org",
    content: "Urban gardening connects people with food systems. Learn container gardening, vertical growing, and soil health. Discover how urban agriculture supports both personal health and environmental sustainability." },
  { emoji: "🚲", title: "Active Transportation Benefits", category: "Environment", recommended: false, readTime: "5 min",
    desc: "Choosing biking and walking for health, environment, and community.",
    source: "League of American Bicyclists",
    sourceUrl: "https://www.bikeleague.org",
    content: "Active transportation offers health and environmental benefits. Learn about infrastructure, safety, and community impact. Discover how choosing active transportation supports personal health and planetary well-being." },
  { emoji: "🌊", title: "Water Conservation Strategies", category: "Environment", recommended: true, readTime: "6 min",
    desc: "Using water wisely at home and in community.",
    source: "Water Environment Federation",
    sourceUrl: "https://www.wef.org",
    content: "Water is precious. Learn conservation techniques that reduce usage without sacrificing comfort." },
  { emoji: "⚡", title: "Energy Efficiency at Home", category: "Environment", recommended: false, readTime: "6 min",
    desc: "Reducing energy consumption and lowering carbon footprint.",
    source: "U.S. Department of Energy",
    sourceUrl: "https://www.energy.gov",
    content: "Energy efficiency saves money and environment. Learn about appliances, insulation, and behavioral changes." },
  { emoji: "🌍", title: "Climate Action at Individual Level", category: "Environment", recommended: true, readTime: "8 min",
    desc: "Personal choices contributing to climate change mitigation.",
    source: "United Nations Climate Change",
    sourceUrl: "https://unfccc.int",
    content: "Climate action starts with individuals. Understand carbon footprint and practical reduction strategies." },
  { emoji: "🐝", title: "Biodiversity & Conservation", category: "Environment", recommended: false, readTime: "6 min",
    desc: "Supporting ecosystems and wildlife in your community.",
    source: "World Wildlife Fund",
    sourceUrl: "https://www.worldwildlife.org",
    content: "Biodiversity is essential for ecosystem health. Learn how to support local wildlife and native plants." },

  // Community (10 articles)
  { emoji: "🤝", title: "Building Community Connections", category: "Community", recommended: true, readTime: "6 min",
    desc: "Creating meaningful relationships and support networks in your community.",
    source: "National Civic League",
    sourceUrl: "https://www.nationalcivicleague.org",
    content: "Strong communities support individual and collective well-being. Learn about relationship building, trust development, and mutual support. Discover strategies for creating inclusive, supportive community networks." },
  { emoji: "🎉", title: "Event Planning for Impact", category: "Community", recommended: false, readTime: "8 min",
    desc: "Organizing community events that create positive social change.",
    source: "Meetup",
    sourceUrl: "https://www.meetup.com",
    content: "Community events build engagement and awareness. Learn planning principles, stakeholder engagement, and impact measurement. Discover how to create events that foster community connection and drive social change." },
  { emoji: "💬", title: "Effective Communication Skills", category: "Community", recommended: false, readTime: "7 min",
    desc: "Communication techniques for collaboration and conflict resolution.",
    source: "International Association of Business Communicators",
    sourceUrl: "https://www.iabc.com",
    content: "Effective communication supports community harmony. Learn active listening, conflict resolution, and collaborative problem-solving. Discover communication strategies that build trust and facilitate positive change." },
  { emoji: "🌟", title: "Leadership in Volunteer Organizations", category: "Community", recommended: false, readTime: "9 min",
    desc: "Developing leadership skills to guide community initiatives and teams.",
    source: "VolunteerMatch",
    sourceUrl: "https://www.volunteermatch.org",
    content: "Volunteer leadership requires specific skills and approaches. Learn about servant leadership, team motivation, and organizational development. Discover how to lead volunteer teams effectively while maintaining enthusiasm and commitment." },
  { emoji: "🤲", title: "Inclusive Community Development", category: "Community", recommended: true, readTime: "7 min",
    desc: "Ensuring all voices are heard in community building.",
    source: "Community Development Society",
    sourceUrl: "https://www.comm-dev.org",
    content: "Inclusive communities are stronger communities. Learn about equity, accessibility, and representation." },
  { emoji: "📢", title: "Advocacy & Social Change", category: "Community", recommended: true, readTime: "8 min",
    desc: "Speaking up for causes and mobilizing community action.",
    source: "Amnesty International",
    sourceUrl: "https://www.amnesty.org",
    content: "Advocacy creates systemic change. Learn persuasion, storytelling, and campaign strategies." },
  { emoji: "🏘️", title: "Neighborhood Safety & Watch", category: "Community", recommended: false, readTime: "5 min",
    desc: "Creating safe, connected neighborhoods together.",
    source: "National Crime Prevention Council",
    sourceUrl: "https://www.ncpc.org",
    content: "Community safety comes from connection. Learn about neighborhood watch and community policing." },
  { emoji: "👨‍👩‍👧", title: "Family Engagement in Community", category: "Community", recommended: false, readTime: "6 min",
    desc: "Getting families involved in community service and volunteering.",
    source: "Points of Light",
    sourceUrl: "https://www.pointsoflight.org",
    content: "Family volunteering strengthens bonds. Explore age-appropriate activities for all family members." },
  { emoji: "🎭", title: "Cultural Events & Celebration", category: "Community", recommended: false, readTime: "5 min",
    desc: "Celebrating diversity through cultural community events.",
    source: "Americans for the Arts",
    sourceUrl: "https://www.americansforthearts.org",
    content: "Cultural events build understanding. Learn about organizing respectful, inclusive celebrations." },
  { emoji: "📍", title: "Local Economic Development", category: "Community", recommended: false, readTime: "7 min",
    desc: "Supporting local businesses and economic resilience.",
    source: "National Main Street Center",
    sourceUrl: "https://www.mainstreet.org",
    content: "Strong local economies benefit everyone. Learn about supporting small business and fair trade." },

  // Health Equity (10 articles)
  { emoji: "⚖️", title: "Understanding Health Disparities", category: "Health Equity", recommended: true, readTime: "10 min",
    desc: "Exploring systemic factors that create health inequities and solutions.",
    source: "Centers for Disease Control and Prevention",
    sourceUrl: "https://www.cdc.gov",
    content: "Health disparities result from complex systemic factors. Learn about social determinants of health, historical context, and current inequities. Discover evidence-based approaches to addressing health disparities and promoting equity." },
  { emoji: "🏥", title: "Accessible Healthcare Advocacy", category: "Health Equity", recommended: false, readTime: "7 min",
    desc: "Advocating for healthcare access and quality for underserved communities.",
    source: "American Medical Association",
    sourceUrl: "https://www.ama-assn.org",
    content: "Healthcare access affects health outcomes significantly. Learn about barriers to care, advocacy strategies, and policy solutions. Discover how to advocate effectively for healthcare equity and improved access." },
  { emoji: "🌍", title: "Global Health Equity", category: "Health Equity", recommended: false, readTime: "8 min",
    desc: "Addressing health inequities on a global scale through international cooperation.",
    source: "World Health Organization",
    sourceUrl: "https://www.who.int",
    content: "Global health equity requires international collaboration. Learn about global health challenges, resource distribution, and cooperative solutions. Discover how local actions contribute to global health equity and international development." },
  { emoji: "💍", title: "Women's Health Equity", category: "Health Equity", recommended: true, readTime: "8 min",
    desc: "Gender-specific health issues and equitable healthcare approaches.",
    source: "Office on Women's Health",
    sourceUrl: "https://www.womenshealth.gov",
    content: "Women's health has unique considerations. Learn about gender disparities, reproductive health, and advocacy." },
  { emoji: "👶", title: "Maternal and Infant Health", category: "Health Equity", recommended: true, readTime: "8 min",
    desc: "Support systems for mothers and reducing preventable infant mortality.",
    source: "March of Dimes",
    sourceUrl: "https://www.marchofdimes.org",
    content: "Maternal health is critical. Learn about prenatal care, safe delivery, and postpartum support." },
  { emoji: "🧒", title: "Child Health & Nutrition", category: "Health Equity", recommended: false, readTime: "7 min",
    desc: "Early childhood development and prevention-focused pediatric care.",
    source: "American Academy of Pediatrics",
    sourceUrl: "https://www.aap.org",
    content: "Children deserve optimal start in life. Learn about vaccines, nutrition, and developmental screening." },
  { emoji: "🧓", title: "Elder Health & Aging Well", category: "Health Equity", recommended: false, readTime: "7 min",
    desc: "Supporting healthy aging and dignified elder care.",
    source: "National Institute on Aging",
    sourceUrl: "https://www.nia.nih.gov",
    content: "Elders deserve respect and good health. Learn about managing chronic conditions and maintaining independence." },
  { emoji: "🌈", title: "LGBTQ+ Health Equity", category: "Health Equity", recommended: false, readTime: "6 min",
    desc: "Affirming healthcare for gender and sexual minorities.",
    source: "GLMA: Health Professionals Advancing LGBTQ Equality",
    sourceUrl: "https://glma.org",
    content: "LGBTQ+ people face health disparities. Learn about affirming care and advocacy." },
  { emoji: "♿", title: "Disability & Accessible Health", category: "Health Equity", recommended: false, readTime: "7 min",
    desc: "Healthcare that serves people with all abilities.",
    source: "American Association of People with Disabilities",
    sourceUrl: "https://www.aapd.com",
    content: "Healthcare must be accessible. Learn about accommodations and disability-affirming medicine." },
  { emoji: "🧠", title: "Mental Health Equity", category: "Health Equity", recommended: true, readTime: "7 min",
    desc: "Ensuring equitable access to mental health services and support.",
    source: "National Alliance on Mental Illness",
    sourceUrl: "https://www.nami.org",
    content: "Mental health is healthcare. Learn about barriers to mental health care and equitable solutions." },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const Library = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);

  const handleDialogScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
  }, []);

  const filtered = articles.filter(a => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
                         a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!selectedArticle) {
      setScrollProgress(0);
    }
  }, [selectedArticle]);

  return (
    <DashboardLayout>
      <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Library</h1>
        </div>
        <p className="text-sm text-muted-foreground">You've read 5/13 articles today</p>
      </motion.div>

      {/* Search */}
      <motion.div className="relative max-w-md mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors" 
          placeholder="Search articles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Category tabs */}
      <motion.div className="flex gap-2 mb-8 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {categories.map(c => (
          <motion.button
            key={c}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveCategory(c)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
          >{c}</motion.button>
        ))}
      </motion.div>

      {/* Articles */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger.container} initial="hidden" animate="visible" key={`${activeCategory}-${searchQuery}`}>
        {filtered.map(a => (
          <motion.div key={a.title} className="glass-card p-5 group cursor-pointer" variants={stagger.item}
            whileHover={{ y: -3, borderColor: "hsla(357,100%,44.5%,0.25)" }}
            onClick={() => setSelectedArticle(a)}
            data-cursor-hover>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{a.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${catColors[a.category] || "bg-secondary text-muted-foreground"}`}>{a.category}</span>
                  {a.recommended && (
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-primary/20 text-primary font-medium flex items-center gap-1">
                      <Star size={8} /> Recommended
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {a.desc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} /> {a.readTime}
                  </div>
                  <motion.button
                    className="text-sm text-primary font-medium hover:underline"
                    data-cursor-hover
                    whileHover={{ x: 3 }}
                  >
                    Read More →
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Article Modal */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <DialogContent
          ref={dialogContentRef}
          onScroll={handleDialogScroll}
          className={`max-w-2xl max-h-[80vh] overflow-y-auto ${selectedArticle ? 'surgical-mode' : ''}`}
        >
          {/* Surgical Progress Bar */}
          {selectedArticle && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600 z-50">
              <motion.div
                className="h-full bg-red-600"
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          )}
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <span className="text-2xl">{selectedArticle?.emoji}</span>
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${catColors[selectedArticle.category] || "bg-muted text-muted-foreground"}`}>
                  {selectedArticle.category}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {selectedArticle.readTime} read
                </div>
                {selectedArticle.recommended && (
                  <div className="flex items-center gap-1 text-primary">
                    <Star size={14} fill="currentColor" />
                    Recommended
                  </div>
                )}
              </div>
              
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-base leading-relaxed mb-4 font-medium">
                  {selectedArticle.desc}
                </p>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {getExpandedArticleContent(selectedArticle)}
                </div>
                
                {/* Source Attribution */}
                {selectedArticle.source && (
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">📖 Article Source:</p>
                    <a 
                      href={selectedArticle.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium flex items-center gap-2"
                    >
                      {selectedArticle.source}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Library;
