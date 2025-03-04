import Post from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await Post.find().populate('user').exec()
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи'
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: 'after' }
		);

		if (!post) {
			return res.status(404).json({
				message: 'Статья не найдена',
			});
		}

		res.json(post);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: 'Не удалось вернуть статью',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await Post.findOneAndDelete({ _id: postId });

		if (!doc) {
			return res.status(404).json({
				message: 'Статья не найдена',
			});
		}

		res.json({
			success: true,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: 'Не удалось удалить статью',
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new Post({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.user
		})
		await Post.syncIndexes();

		const post = await doc.save();
		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать статью'
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await Post.updateOne({ _id: postId }, {
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.user
		});
		res.json({
			success: true,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Не удалось обновить статью'
		})
	}
}