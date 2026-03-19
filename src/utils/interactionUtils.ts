export const validateRating = (rating: number): number => {
  if (rating < 1) return 1;
  if (rating > 5) return 5;
  return Math.round(rating);
};

export const formatComment = (comment: string): string => {
  return comment.trim().substring(0, 500);
};
