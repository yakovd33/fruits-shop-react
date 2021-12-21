const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

const getMessagesWithUser = async (user_id, with_id) => {
	let messages = [];

	try {
		let messages_query = await pool.query(
			"SELECT * FROM chat_messages WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1)",
			[user_id, with_id]
		);

		for (var i = 0; i < messages_query.rows.length; i++) {
			let message = messages_query.rows[i];
			let self = message.from_id == user_id ? "self" : "";

			messages.push({
				text: message.message,
				self,
			});
		}
	} catch (e) {
		console.log(e);
	}

	return messages;
};

// Send message
router.post("/message/:user_id", verifyToken, async (req, res, next) => {
	let user_id = req.params.user_id;
	let from_id = req.headers.uid;
	let message = req.body.message;

	if (!user_id || !message) return;

	try {
		// Check if there's a chatbox open
		let chatbox = await pool.query(
			`SELECT * FROM chats WHERE (user1_id = ${from_id} AND user2_id = ${user_id}) OR (user1_id = ${user_id} AND user2_id = ${from_id})`
		);

		if (!chatbox.rows.length) {
			// Chatbox doesn't exists - create it
			const chatbox_query = await pool.query(
				`INSERT INTO chats (user1_id, user2_id) VALUES ($1, $2)`,
				[from_id, user_id]
			);
			chatbox = await pool.query(
				`SELECT * FROM chats WHERE (user1_id = ${from_id} AND user2_id = ${user_id}) OR (user1_id = ${user_id} AND user2_id = ${from_id})`
			);
		}

		let chatbox_id = chatbox.rows[0].id;

		// Insert the message
		pool.query(
			"INSERT INTO chat_messages (chat_id, from_id, to_id, message) VALUES($1, $2, $3, $4)",
			[chatbox_id, from_id, user_id, message]
		);

		// TODO: Open chatbox for the adresee
	} catch (e) {
		console.log(e);
	}

	res.send("eeee");
});

router.post("/open_chatbox/:user_id", verifyToken, async (req, res, next) => {
	let with_id = req.params.user_id;
	let user_id = req.headers.uid;

	if (user_id && with_id) {
		// Check if chatbox is already open

		let chatbox_check_query = await pool.query(
			"SELECT * FROM open_chatboxes WHERE user_id = $1 AND with_id = $2",
			[user_id, with_id]
		);
		if (!chatbox_check_query.rows.length) {
			const newOpenChat = pool.query(
				"INSERT INTO open_chatboxes (user_id, with_id) VALUES($1, $2)",
				[user_id, with_id]
			);
		}
	}

	res.send("");
});

router.get("/open_chatboxes", verifyToken, async (req, res, next) => {
	let user_id = req.headers.uid;

	let chatboxes = [];

	let chatboxes_query = await pool.query(
		`SELECT * FROM open_chatboxes WHERE user_id = ${user_id}`
	);

	for (var i = 0; i < chatboxes_query.rows.length; i++) {
		let chatbox = chatboxes_query.rows[i];
		let with_id = chatbox.with_id;
		let user = await pool.query(
			`SELECT * FROM users WHERE id = ${with_id}`
		);

		// Get all messages with user

		if (user.rows.length) {
			chatboxes.push({
				fullname: user.rows[0].fullname,
				user_id: with_id,
				messages: await getMessagesWithUser(user_id, with_id),
			});
		}
	}

	res.status(200).send(chatboxes);
});

router.delete("/open_chatbox/:user_id", verifyToken, (req, res, next) => {
	let with_id = req.params.user_id;
	let user_id = req.headers.uid;

	if (with_id && user_id) {
		pool.query(
			"DELETE FROM open_chatboxes WHERE user_id = $1 AND with_id = $2",
			[user_id, with_id]
		);
	}

	res.send("");
});

router.get("/chat_messages/:user_id", verifyToken, async (req, res, next) => {
	let with_id = req.params.user_id;
	let user_id = req.headers.uid;

	if (with_id && user_id) {
		let messages = await getMessagesWithUser(user_id, with_id);
		res.status(200).json(messages);
        return;
	}

	res.status(200).json([]);
});

router.get('/chat_list', verifyToken, async (req, res, next) => {
	let user_id = req.headers.uid;
	let chats = [];

	if (user_id) {
		try {
		let chats_query = await pool.query(`SELECT * FROM chats WHERE user1_id = ${user_id} OR user2_id = ${user_id}`);
		for (var i = 0; i < chats_query.rows.length; i++) {
			let chat = chats_query.rows[i];
			let other_user_id = chat.user1_id == user_id ? chat.user2_id : chat.user1_id;
			let other_user_query = await pool.query(`SELECT * FROM users WHERE id = ${ other_user_id }`);
			
			if (other_user_query.rows.length) {
				let other_user = other_user_query.rows[0];
				
				// Get the chat last message
				let last_msg_query = await pool.query(`SELECT * FROM chat_messages WHERE (from_id = ${ user_id } AND to_id = ${ other_user_id}) OR (from_id = ${ other_user_id } AND to_id = ${ user_id}) ORDER BY date DESC LIMIT 1`);
				let last_message = '';

				if (last_msg_query.rows.length) last_message = last_msg_query.rows[0].message

				chats.push({
					id: other_user_id,
					fullname: other_user.fullname,
					last_message
				})
			}
		}
		} catch (e) {
			console.log(e);
		}
	}

	res.status(200).json(chats);
})

module.exports = router;
