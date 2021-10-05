const Comment = require('../models/comment');
const Joi = require('joi');
const { ErrorResponse, SuccessResponse } = require('../global/function');
const { default: axios } = require('axios');
const {
  sumHeight,
  handleSort,
  handleFilter,
  convertHeightToFeet
} = require('../utils/util');

const instance = axios.create({
  baseURL: 'https://swapi.dev/api'
});

const addNewComment = async (req, res) => {
  const schema = Joi.object({
    film: Joi.number().required(),
    message: Joi.string().required().max(500)
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return ErrorResponse(res, error.details[0].message, 400);
  }

  try {
    const { film, message } = req.body;

    const { data } = await instance.get(`/films/${film}`);
    if (!data) {
      return ErrorResponse(res, 'Invalid film id', 400);
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!ip) {
      return ErrorResponse(res, 'Could not get user ip address', 400);
    }

    const comment = await Comment.create({
      ip,
      film,
      message,
      createdAt: new Date()
    });

    if (!comment) {
      return ErrorResponse(res, 'Could not add comment', 400);
    }

    return SuccessResponse(res, 'Comment added successfully', comment);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, error, 500);
  }
};

// name, opening crawls and comment counts
const getMoviesDetails = async (req, res) => {
  try {
    const { data: response } = await instance.get('/films');
    const movies = response.results;
    if (!movies) {
      return ErrorResponse(res, 'Could not fetch movies', 400);
    }

    const sortedMovies = movies.sort(
      (a, b) =>
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );

    const data = await Promise.all(
      sortedMovies.map(async (movie, idx) => {
        const comments = await Comment.count({ where: { film: idx + 1 } });
        const { title, opening_crawl } = movie;
        return {
          title,
          comments,
          opening_crawl
        };
      })
    );

    return SuccessResponse(res, 'Movies list fetched successfully', data);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, error, 500);
  }
};

const getCommentsForMovie = async (req, res) => {
  try {
    const { film } = req.params;
    if (!film || !parseInt(film)) {
      return ErrorResponse(res, 'Invalid film id', 400);
    }
    const comments = await Comment.findAll({
      where: { film },
      order: [['createdAt', 'DESC']]
    });
    if (!comments) {
      return ErrorResponse(res, 'Could not fetch comments for movie', 400);
    }

    return SuccessResponse(
      res,
      'Comments for movie fetched successfully',
      comments
    );
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, error, 500);
  }
};

// Character list for a movie

const getCharacterListForAMovie = async (req, res) => {
  const schema = Joi.object({
    filter: Joi.string().valid('female', 'male').required(),
    sortOrder: Joi.string().valid('ascending', 'descending').required(),
    sortBy: Joi.string().valid('name', 'gender', 'height').required()
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return ErrorResponse(res, error.details[0].message, 400);
  }

  try {
    const { film } = req.params;
    if (!film || !parseInt(film)) {
      return ErrorResponse(res, 'Invalid film id', 400);
    }

    const { sortBy, sortOrder, filter } = req.query;
    const { data: movie } = await instance.get(`/films/${film}`);
    if (!movie) {
      return ErrorResponse(res, 'Invalid film id', 400);
    }

    const data = await Promise.all(
      movie.characters.map(async (characterUrl) => {
        const { data: character } = await axios.get(characterUrl);
        return character;
      })
    );

    const filteredData = handleFilter(data, filter);
    const sortedData = handleSort(filteredData, sortOrder, sortBy);
    const totalHeight = sumHeight(filteredData);

    const response = {
      characters: sortedData,
      meta: {
        count: sortedData.length,
        totalHeight: `${totalHeight} cm`,
        heightInFeet: convertHeightToFeet(totalHeight)
      }
    };

    return SuccessResponse(res, 'Character list fetced successfully', response);
  } catch (error) {
    console.log(error);
    return ErrorResponse(res, error, 500);
  }
};

module.exports = {
  addNewComment,
  getMoviesDetails,
  getCommentsForMovie,
  getCharacterListForAMovie
};
