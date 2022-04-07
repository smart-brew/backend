import queryErrorHanlder from '../queryErrorHandler';
import db from '../prismaClient';

export const setBrewingState = async (id: number, state: string) => {
  try {
    await db.brewings.update({
      where: {
        id,
      },
      data: {
        state,
      },
    });
  } catch (e) {
    queryErrorHanlder(e, 'Brewing state update query');
  }
};
