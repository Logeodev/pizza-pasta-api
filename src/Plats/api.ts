import { BadRequest, Endpoint, Exception, NotFound, Ok } from 'global/api';
import { Request } from 'express';
import { Plat } from 'Plats/models';
import { PlatsService } from 'Plats/platsService';
import { z } from 'zod';
import { validate } from 'global/validations';

export const getPlatByIdAPI = (platsService: PlatsService): Endpoint => (req: Request) => {
  const id = Number(req.params.id);

  if (isNaN(id))
    return Promise.resolve(BadRequest([Exception('id', 'ID is not a number')]));

  return platsService.getPlatById(id)
    .then((ePlat) =>
      ePlat.cata(
        (e) => BadRequest([e]),
        (mPlat) =>
          mPlat.cata(
            () => NotFound('Plat inconnu'),
            Ok
          )
      )
    );
};

const PlatForm = z.object({
  nom: z.string().max(30, { message: 'Nom du plat trop long' }),
  categorieId: z.number(),
  prix: z.number().min(0, { message: 'Les plats ne peuvent être gratuits' }),
  ingredients: z.string()
});

type PlatForm = z.infer<typeof PlatForm>;

export const addPlatAPI = (platsService: PlatsService): Endpoint => (req: Request) =>
  validate(PlatForm)(req.body)((plat: PlatForm) =>
    platsService.createPlat({
      ...plat,
      id: 0,
      categorieId: Number(plat.categorieId),
      prix: Number(plat.prix)
    })
      .then((ePlat) =>
        ePlat.cata(
          (e) => BadRequest([e]),
          Ok
        )
      )
  );

const UpdatePlatForm =
  PlatForm.and(
    z.object({
      id: z.number()
    })
  );

type UpdatePlatForm = z.infer<typeof UpdatePlatForm>;

export const updatePlatAPI = (platsService: PlatsService): Endpoint => (req: Request) =>
  validate(UpdatePlatForm)
    ({ ...req.body, id: Number(req.params.id) })
    ((plat: UpdatePlatForm) =>
      platsService.modifyPlat({
        ...plat,
        categorieId: Number(plat.categorieId),
        prix: Number(plat.prix)
      })
        .then(Ok)
    );

export const deletePlatAPI = (platsService: PlatsService): Endpoint => (req: Request) =>
  validate(z.number())
    (Number(req.params.id))
    ((id: number) =>
      platsService.removePlat(id)
        .then(() => Ok())
    );