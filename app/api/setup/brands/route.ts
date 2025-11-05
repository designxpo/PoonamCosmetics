import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

export async function POST() {
  try {
    await dbConnect();

    // Check if brands already exist
    const existingBrands = await Brand.countDocuments();
    if (existingBrands > 0) {
      return NextResponse.json({
        success: false,
        message: 'Brands already exist. Delete existing brands first if you want to reset.',
      });
    }

    // Dummy brand data with popular cosmetic brands
    const brands = [
      {
        name: 'Maybelline',
        slug: 'maybelline',
        logo: 'https://via.placeholder.com/200x200/FF3366/FFFFFF?text=Maybelline',
        description: 'Maybe she\'s born with it. Maybe it\'s Maybelline.',
        isActive: true,
        order: 1,
      },
      {
        name: 'L\'Oréal Paris',
        slug: 'loreal-paris',
        logo: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=L%27Oreal',
        description: 'Because you\'re worth it',
        isActive: true,
        order: 2,
      },
      {
        name: 'Lakmé',
        slug: 'lakme',
        logo: 'https://via.placeholder.com/200x200/FF1744/FFFFFF?text=Lakme',
        description: 'India\'s leading cosmetics brand',
        isActive: true,
        order: 3,
      },
      {
        name: 'MAC Cosmetics',
        slug: 'mac-cosmetics',
        logo: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=MAC',
        description: 'Professional makeup artistry',
        isActive: true,
        order: 4,
      },
      {
        name: 'Revlon',
        slug: 'revlon',
        logo: 'https://via.placeholder.com/200x200/E91E63/FFFFFF?text=Revlon',
        description: 'Live boldly',
        isActive: true,
        order: 5,
      },
      {
        name: 'NYX Professional',
        slug: 'nyx-professional',
        logo: 'https://via.placeholder.com/200x200/000000/FFFFFF?text=NYX',
        description: 'Professional makeup for everyone',
        isActive: true,
        order: 6,
      },
      {
        name: 'Colorbar',
        slug: 'colorbar',
        logo: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Colorbar',
        description: 'Feel beautiful',
        isActive: true,
        order: 7,
      },
      {
        name: 'Faces Canada',
        slug: 'faces-canada',
        logo: 'https://via.placeholder.com/200x200/FF6F00/FFFFFF?text=Faces',
        description: 'Go beyond the obvious',
        isActive: true,
        order: 8,
      },
      {
        name: 'Sugar Cosmetics',
        slug: 'sugar-cosmetics',
        logo: 'https://via.placeholder.com/200x200/FF4081/FFFFFF?text=Sugar',
        description: 'Nothing else matters',
        isActive: true,
        order: 9,
      },
      {
        name: 'Swiss Beauty',
        slug: 'swiss-beauty',
        logo: 'https://via.placeholder.com/200x200/E53935/FFFFFF?text=Swiss+Beauty',
        description: 'Define your beauty',
        isActive: true,
        order: 10,
      },
    ];

    const createdBrands = await Brand.insertMany(brands);

    return NextResponse.json({
      success: true,
      message: `${createdBrands.length} brands created successfully`,
      brands: createdBrands,
    });
  } catch (error: any) {
    console.error('Error creating brands:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to reset brands
export async function DELETE() {
  try {
    await dbConnect();
    
    const result = await Brand.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} brands deleted successfully`,
    });
  } catch (error: any) {
    console.error('Error deleting brands:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
