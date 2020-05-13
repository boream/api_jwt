const logger = require('logger');
const Router = require('@koa/router');
const mongoose = require('mongoose');
const FilmValidator = require('validators/film.validator');
const FilmModel = require('models/film.model');

class FilmRouter {
    static async get(ctx) {
        logger.info('Obtaining all films');
        ctx.body = await FilmModel.find();
    }

    static async getById(ctx) {
        logger.info(`Obtaining film with id ${ctx.params.id}`);
        const film = await FilmModel.findById(ctx.params.id);
        if (!film) {
            ctx.throw(404, 'Film not found');
        }
        ctx.body = film;
    }

    static async create(ctx) {
        logger.info(`Creating new film with body ${ctx.request.body}`);
        const film = {
            name: ctx.request.body.name,
            year: ctx.request.body.year,
            gender: ctx.request.body.gender,
            image: ctx.request.body.image,
            imdbUrl: ctx.request.body.imdbUrl
        };
        ctx.body =  await new FilmModel(film).save();
        ctx.status = 201;
    }

    static async update(ctx) {
        logger.info(`Updating film with id ${ctx.params.id}`);
        let film = null;
        try {
            film = await FilmModel.findById(ctx.params.id);
        } catch (error) {
            logger.error(error);
            ctx.throw(404, 'Error en la base de datos');
        }
        if (!film) {
            ctx.throw(404, 'Film not found');
            return;
        }
        
        Object.assign(film, ctx.request.body);
        
        ctx.body = await film.save();
    }

    static async delete(ctx) {
        logger.info(`Deleting film with id ${ctx.params.id}`);
        let numDeleted = 0
        try {
            numDeleted = await FilmModel.remove({_id: mongoose.Types.ObjectId(ctx.params.id)});
        } catch (error) {
            logger.error(error);
            ctx.throw(404, 'Error en la base de datos');
        }
        logger.debug('Element removed ', numDeleted);

        if (numDeleted.deletedCount <= 0) {
            ctx.throw(404, 'Film not found');
            return;
        }

        ctx.body = numDeleted;
    }
}

const router = new Router({ prefix: '/film' });
router.get('/', FilmRouter.get);
router.get('/:id', FilmValidator.validateId, FilmRouter.getById);
router.post('/', FilmValidator.validateCreate, FilmRouter.create);
router.put('/:id', FilmValidator.validateId, FilmRouter.update);
router.delete('/:id', FilmValidator.validateId, FilmRouter.delete);

module.exports = router;