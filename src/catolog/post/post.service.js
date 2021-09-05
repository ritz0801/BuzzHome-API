import db from "../../../database/models/db";
import { sequelize } from "../../../database/models/index";
import NodeGeocoder from "node-geocoder";

let geocoder = NodeGeocoder({
	provider: "opencage",
	apiKey: "f99d7f54b48a46d8b23e8f8e6d6e1a03",
	region: "Vietnam",
});

import {
	getCoordinateLatCondition,
	getCoordinateLngCondition,
	getPriceCondition,
} from "./post.util";

export const deleteById = async (id) => {
	const rs = await db.Posts.destroy({
		where: {
			id,
		},
		include: CommentAndImgInclude,
		nest: true,
	});
	console.log("Item deleted: ", rs);
	return rs;
};

const CommentAndImgInclude = [
	// {
	// 	model: db.Comments,
	// 	where: { commentId: null },
	// 	as: "postComment",
	// 	include: {
	// 		model: db.Comments,
	// 		as: "replyComment",
	// 		required: false,
	// 		separate: true,
	// 	},
	// 	required: false,
	// 	separate: true,
	// },
	{
		model: db.ImageLinks,
		as: "postImg",
		required: false,
		separate: true,
	},
];

export const getAll = async ({ limit, offset }) => {
	const pagintationQuery = limit !== undefined ? { limit, offset } : {};
	const rs = await db.Posts.findAndCountAll({
		order: [["updatedAt", "DESC"]],
		include: CommentAndImgInclude,
		...pagintationQuery,
		nest: true,
	});

	return rs;
};

export const getById = async (id) => {
	const rs = await db.Posts.findOne({
		where: {
			id,
		},
		include: CommentAndImgInclude,
		nest: true,
	});

	return rs;
};

export const filter = async ({
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
}) => {
	const priceCondition = getPriceCondition(minPrice, maxPrice);
	const districtCondition = district ? { district } : {};
	const latCondition = getCoordinateLatCondition(minLat, maxLat);
	const lngCondition = getCoordinateLngCondition(minLng, maxLng);

	const pagintationQuery = limit !== undefined ? { limit, offset } : {};

	const rs = await db.Posts.findAndCountAll({
		where: {
			isForRenter,
			...districtCondition,
			...priceCondition,
			...latCondition,
			...lngCondition,
			isForRenter,
		},
		include: CommentAndImgInclude,
		...pagintationQuery,
		nest: true,
	});

	return rs;
};

export const updateCount = async (id) => {
	const postData = await db.Posts.findOne({
		where: {
			id,
		},
		raw: true,
	});
	console.debug("post data: ", postData);

	// const rs = await db.Posts.increment('count', { by: 1, where: { id } })
	const rs = await db.Posts.update(
		{ count: (postData.count || 0) + 1 },
		{ where: { id } }
	);

	return rs;
};

export const createItem = async ({
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
}) => {
	const data = await geocoder.geocode(
		{ address: `${address} ${street} ${district} ${country}` },
		async (err, res) => {
			console.log("res: ", res)
			// console.log("res: ", {
			// 	lng: res[0].longitude,
			// 	lat: res[0].latitude,
			// 	district: district,
			// 	street: street,
			// 	address: address,
			// 	price: price,
			// 	content: content,
			// 	datePosting: datePosting,
			// 	username: username,
			// 	userAvatar: userAvatar,
			// 	isForRenter: isForRenter,
			// 	phone: phone,
			// });
			const t = await sequelize.transaction();
			try {
				const rs = await db.Posts.create(
					{
						lng: res.length ? res[0].longitude : 106.676292,
						lat: res.length ? res[0].longitude : 10.746903,
						district: district,
						street: street,
						address: address,
						price: price,
						content: content,
						datePosting: datePosting,
						username: username,
						userAvatar: userAvatar,
						isForRenter: isForRenter,
						phone: phone,
					},
					{ transaction: t }
				);

			//	console.log(180, rs);

				let arrayImageLinks = imageLink.map((item) => {
					return {
						postId: rs.dataValues.id,
						link: item,
					};
				});

				await db.ImageLinks.bulkCreate(arrayImageLinks, { transaction: t });

				await t.commit();
				return { status: true }
			} catch (err) {
				await t.rollback();
				return { status: false };
			}
		}
	);
//	console.log("DATAAAAA: ", data);
	return data;
};

export const getByUsername = async (username) => {
	const rs = await db.Posts.findAll({
		where: {
			username,
		},
		include: CommentAndImgInclude,
		nest: true,
	});
	return rs;
};

export const updateItem = async ({
	id,
	district,
	address,
	street,
	country,
	price,
	content,
	phone,
	imageLink,
}) => {
	const t = await sequelize.transaction();
	try {
		const rs = await db.Posts.update(
			{
				district: district,
				address: address,
				street: street,
				country: country,
				price: price,
				content: content,
				phone: phone,
			},
			{ where: { id: id } },
			{ transaction: t }
		);

		await db.ImageLinks.destroy(
			{
				where: {
					postId: id,
				},
			},
			{ transaction: t }
		);

		let arrayImageLinks = imageLink.map((item) => {
			return {
				postId: id,
				link: item,
			};
		});

		console.log(arrayImageLinks);
		await db.ImageLinks.bulkCreate(arrayImageLinks, { transaction: t });
		await t.commit();

		return rs;
	} catch (err) {
		await t.rollback();
		return { status: false };
	}
};
