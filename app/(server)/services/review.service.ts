import { Prisma, Review } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import logs from "@/lib/utils/logs";

async function createReview(
  userId: number,
  productId: number,
  rating: number,
  comment?: string | null,
): Promise<{ success: boolean; review?: Review; error?: string }> {
  try {
    const newReview: Prisma.ReviewCreateManyInput = {
      userId,
      productId,
      rating,
      comment,
    };

    const review = await prisma.review.create({ data: newReview });

    if (!review)
      return {
        success: false,
        error: "Avis non publier, veuillez réesséyer plus tard.",
      };

    return { success: true, review };
  } catch (error) {
    console.error("Create review error : ", error);
    return {
      success: false,
      error: logs.error.create.review,
    };
  }
}

async function readReviews(
  searchQuery?: string,
  sortBy: string = "newest",
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  reviews?: Review[];
  total?: number;
  error?: string;
}> {
  try {
    const skip = (page - 1) * limit;
    const take = page * limit;

    const select: Prisma.ReviewSelect = {
      id: true,
      userId: true,
      productId: true,
      rating: true,
      comment: true,
    };

    const where: Prisma.ReviewWhereInput = {
      comment: {
        contains: searchQuery,
        mode: "insensitive",
      },
    };

    let orderBy: Prisma.ReviewOrderByWithRelationInput;

    switch (sortBy) {
      case "rating-asc":
        orderBy = {
          rating: "asc",
        };
        break;
      case "rating-desc":
        orderBy = {
          rating: "desc",
        };
        break;
      case "newest":
        orderBy = {
          createdAt: "desc",
        };
        break;
      default:
        orderBy = {
          createdAt: "asc",
        };
        break;
    }

    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        select,
        skip,
        take,
        where,
        orderBy,
      }),
      prisma.review.count({
        where,
        orderBy,
      }),
    ]);

    if (!reviews || !total)
      return { success: false, error: "Aucun avis trouvé" };

    return { success: true, reviews, total };
  } catch (error) {
    console.error("Read reviews error : ", error);
    return {
      success: false,
      error: logs.error.read.reviews,
    };
  }
}

async function readReview(id: number): Promise<{
  success: boolean;
  review?: Review;
  error?: string;
}> {
  try {
    const select: Prisma.ReviewSelect = {
      id: true,
      rating: true,
      comment: true,
      user: true,
      product: true,
    };

    const review = await prisma.review.findUnique({
      where: { id: id },
      select,
    });

    if (!review)
      return { success: false, error: "Aucune information de l'avis trouvée" };

    return { success: true, review };
  } catch (error) {
    console.error("Read review error : ", error);
    return {
      success: false,
      error: logs.error.read.review,
    };
  }
}

async function updateReview(
  id: number,
  rating: number,
  comment?: string | null,
): Promise<{
  success: boolean;
  review?: Review;
  error?: string;
}> {
  try {
    const review = await prisma.review.update({
      where: { id: id },
      data: { rating, comment },
    });

    if (!review)
      return {
        success: false,
        error: "Votre avis n'a pas été publier, veuillez réesseyer",
      };

    return { success: true, review };
  } catch (error) {
    console.error("Update review error : ", error);
    return {
      success: false,
      error: logs.error.update.review,
    };
  }
}

async function deleteReview(where: Prisma.ReviewWhereUniqueInput) {
  return prisma.review.delete({
    where,
  });
}

export { createReview, deleteReview, readReview, readReviews, updateReview };
