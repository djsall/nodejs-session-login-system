let Sequelize = require('sequelize');
let bcrypt = require('bcrypt');

const sequelize = new Sequelize('test', 'root', '', {
	host: 'localhost',
	dialect: 'mysql'
});
// setup User model and its fields.
let User = sequelize.define(
	'node_users', {
		username: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		}
	}, {
		hooks: {
			beforeCreate: user => {
				const salt = bcrypt.genSaltSync();
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}
	}
);
User.prototype.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

// create all the defined tables in the specified database.
sequelize
	.sync()
	.then(() =>
		console.log(
			"Users table has been successfully created, if one didn't exist."
		)
	)
	.catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;
