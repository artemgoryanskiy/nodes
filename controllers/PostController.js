import Post from '../models/Post.js';

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