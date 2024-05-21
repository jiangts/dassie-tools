const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Define models
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

const Transaction = sequelize.define('Transaction', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id'
    },
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
});

// Define associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Transaction, { foreignKey: 'productId' });
Transaction.belongsTo(Product, { foreignKey: 'productId' });

// Sample data
const users = [
  { name: 'Alice', email: 'alice@example.com', location: 'New York' },
  { name: 'Bob', email: 'bob@example.com', location: 'Los Angeles' },
  { name: 'Charlie', email: 'charlie@example.com', location: 'Chicago' },
  { name: 'David', email: 'david@example.com', location: 'Houston' },
  { name: 'Eva', email: 'eva@example.com', location: 'Phoenix' }
];

const products = [
  { name: 'Wooden Elephant', description: 'A small wooden elephant figurine.', price: 10.99, stock: 100 },
  { name: 'Ceramic Vase', description: 'A beautifully painted ceramic vase.', price: 15.99, stock: 50 },
  { name: 'Glass Marble', description: 'A colorful glass marble.', price: 1.99, stock: 200 },
  { name: 'Handmade Necklace', description: 'A handmade beaded necklace.', price: 25.99, stock: 30 },
  { name: 'Metal Keychain', description: 'A sturdy metal keychain.', price: 5.99, stock: 150 }
];

const seedDatabase = async () => {
  await sequelize.sync({ force: true }); // Recreates the database and tables
  console.log('Database synced!');

  // Insert sample data
  await User.bulkCreate(users);
  await Product.bulkCreate(products);

  // Create some transactions
  const allUsers = await User.findAll();
  const allProducts = await Product.findAll();

  const transactions = [
    { userId: allUsers[0].id, productId: allProducts[0].id, quantity: 2, totalPrice: allProducts[0].price * 2 },
    { userId: allUsers[1].id, productId: allProducts[1].id, quantity: 1, totalPrice: allProducts[1].price },
    { userId: allUsers[2].id, productId: allProducts[2].id, quantity: 10, totalPrice: allProducts[2].price * 10 },
    { userId: allUsers[3].id, productId: allProducts[3].id, quantity: 3, totalPrice: allProducts[3].price * 3 },
    { userId: allUsers[4].id, productId: allProducts[4].id, quantity: 5, totalPrice: allProducts[4].price * 5 }
  ];

  await Transaction.bulkCreate(transactions);

  console.log('Database seeded!');
  sequelize.close();
};

seedDatabase().catch(error => {
  console.error('Failed to seed database:', error);
});
