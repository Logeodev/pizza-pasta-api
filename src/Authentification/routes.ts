import { useEndpoint } from 'global/api';
import { creerCompteAPI, loginAPI } from 'Authentification/api';
import authentificationService from 'Authentification/authentificationService';
import { Express } from 'express';

const authentificationRoutes = (app: Express) => {
  app.post('/creer-compte', useEndpoint(creerCompteAPI(authentificationService)));

  app.post('/login', useEndpoint(loginAPI(authentificationService)));
};

export default authentificationRoutes;