import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HighlightBox from '@/models/HighlightBox';
import NavigationItem from '@/models/NavigationItem';
import FeatureBox from '@/models/FeatureBox';

export async function POST() {
  try {
    await connectDB();

    // Setup default highlights
    const highlights = [
      {
        title: 'Bridal Chosen Makeup',
        description: 'Handpicked premium products for brides',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        link: '/collection/bridal-chosen',
        bgColor: 'from-pink-100 to-rose-100',
        isActive: true,
        order: 1,
      },
      {
        title: 'Handcrafted Mehndi Cones',
        description: 'Traditional mehndi for your special day',
        image: 'https://images.unsplash.com/photo-1610873167013-4c098f9a9d5c?auto=format&fit=crop&w=600&q=80',
        link: '/category/mehndi',
        bgColor: 'from-amber-100 to-orange-100',
        isActive: true,
        order: 2,
      },
      {
        title: 'Limited Time Discount',
        description: 'Up to 30% off on bridal packages',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
        link: '/products?sale=true',
        bgColor: 'from-red-100 to-pink-100',
        isActive: true,
        order: 3,
      },
      {
        title: 'Royal Bridal Sets',
        description: 'Complete bridal makeup collections',
        image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=600&q=80',
        link: '/collection/royal-bridal',
        bgColor: 'from-purple-100 to-indigo-100',
        isActive: true,
        order: 4,
      },
    ];

    // Setup default navigation
    const navigation = [
      { label: 'Home', href: '/', isActive: true, order: 1 },
      { label: 'Bridal', href: '/collection/bridal', isActive: true, order: 2 },
      { label: 'Cosmetics', href: '/category/cosmetics', isActive: true, order: 3 },
      { label: 'Skincare', href: '/category/skincare', isActive: true, order: 4 },
      { label: 'Haircare', href: '/category/haircare', isActive: true, order: 5 },
      { label: 'Offers', href: '/products?sale=true', isActive: true, order: 6 },
      { label: 'Contact', href: '/contact', isActive: true, order: 7 },
    ];

    // Setup default features
    const features = [
      { icon: '🚚', title: 'Free Shipping', description: 'On orders above ₹999', isActive: true, order: 1 },
      { icon: '✨', title: '100% Authentic', description: 'Genuine products guaranteed', isActive: true, order: 2 },
      { icon: '💝', title: 'Bridal Special', description: 'Expert consultation available', isActive: true, order: 3 },
      { icon: '💬', title: '24/7 Support', description: 'We\'re here to help', isActive: true, order: 4 },
    ];

    // Clear existing data
    await HighlightBox.deleteMany({});
    await NavigationItem.deleteMany({});
    await FeatureBox.deleteMany({});

    // Insert new data
    await HighlightBox.insertMany(highlights);
    await NavigationItem.insertMany(navigation);
    await FeatureBox.insertMany(features);

    return NextResponse.json({
      success: true,
      message: 'Dynamic content setup completed successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
