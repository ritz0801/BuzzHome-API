import httpStatusCodes from "http-status-codes";
import * as postService from "./post.service";
import {
	MESSAGE_ERROR,
	MESSAGE_INVALID_PAGINATION,
} from "../../utils/constant.ultils";
import { checkLimitOffset } from "../../utils/function.utils";

export const deleteById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const rs = await postService.deleteById(id);

		return res.status(httpStatusCodes.OK).json({
			payload: rs,
		});
	} catch (err) {
		return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const getAll = async (req, res, next) => {
	try {
		const { limit, offset } = req.query;

		if (checkLimitOffset(limit, offset)) {
			const rs = await postService.getAll({ limit, offset });
			return res.status(httpStatusCodes.OK).json({
				payload: rs,
			});
		}

		return res.status(httpStatusCodes.BAD_REQUEST).json({
			message: MESSAGE_INVALID_PAGINATION,
		});
	} catch (err) {
		return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const getById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const rs = await postService.getById(id);

		return res.status(httpStatusCodes.OK).json({
			payload: rs,
		});
	} catch (err) {
		return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const filter = async (req, res, next) => {
	try {
		const {
			district,
			minPrice,
			maxPrice,
			minLat,
			maxLat,
			minLng,
			maxLng,
			isForRenter,
			limit,
			offset,
		} = req.body;
		const rs = await postService.filter({
			district,
			minPrice,
			maxPrice,
			minLat,
			maxLat,
			minLng,
			maxLng,
			isForRenter,
			limit,
			offset,
		});

		if (checkLimitOffset(limit, offset)) {
			return res.status(httpStatusCodes.OK).json({
				payload: rs,
			});
		}

		return res.status(httpStatusCodes.BAD_REQUEST).json({
			message: MESSAGE_INVALID_PAGINATION,
		});
	} catch (err) {
		console.debug("err: ", err);
		return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const updateCount = async (req, res, next) => {
	try {
		const { id } = req.params;
		const rs = await postService.updateCount(id);

		return res.status(httpStatusCodes.OK).json({
			payload: rs,
		});
	} catch (err) {
		console.debug("err: ", err);
		return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const createItem = async (req, res, next) => {
	try {
		const {
			district,
			address,
			street,
			country,
			price,
			content,
			datePosting,
			username,
			userAvatar,
			isForRenter,
			phone,
			imageLink,
		} = req.body;

		//console.log("body:", req.body);

		const rs = await postService.createItem({
			district,
			address,
			street,
			country,
			price,
			content,
			datePosting,
			username,
			userAvatar,
			isForRenter,
			phone,
			imageLink,
		});
		console.log("Data: ", rs);

		if (rs.status === false) {
			throw Error("Error when create");
		}
		console.log("163")
		return res.status(httpStatusCodes.OK).json({
			payload: rs,
		});
	} catch (err) {
		return res.status(httpStatusCodes.BAD_REQUEST).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const getByUsername = async (req, res, next) => {
	try {
		const { username } = req.params;
		const rs = await postService.getByUsername(username);

		return res.status(httpStatusCodes.OK).json({
			payload: rs,
		});
	} catch (err) {
		return res.status(httpStatusCodes.BAD_REQUEST).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};

export const updateItem = async (req, res, next) => {
	try {
		const { id } = req.params;
		const {
			district,
			address,
			street,
			country,
			price,
			content,
			phone,
			imageLink,
		} = req.body;
		const rs = await postService.updateItem({
			id,
			district,
			address,
			street,
			country,
			price,
			content,
			phone,
			imageLink,
		});
		console.log("Data: ", rs);

		if (rs.status === false) {
			throw Error("Error when create");
		}
		return res.status(httpStatusCodes.OK).json({
			payload: rs,
		});
	} catch (err) {
		return res.status(httpStatusCodes.BAD_REQUEST).json({
			message: MESSAGE_ERROR,
			log: err.message,
		});
	}
};
