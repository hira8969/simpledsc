import mongoose from 'mongoose';

const validityPricingSchema = new mongoose.Schema({
  years: { type: Number, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  shortDescription: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  fullDescription: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    default: 1499
  },
  basePrice: {
    type: Number,
    default: 1499
  },
  validity: {
    type: String,
    default: '1 Year'
  },
  validityOptions: [validityPricingSchema],
  image: {
    type: String,
    default: 'epass2003'
  },
  features: [{
    type: String
  }],
  suitableFor: [{
    type: String
  }],
  useCases: [{
    type: String
  }],
  requiredDocuments: [{
    type: String
  }],
  documentsRequired: [{
    type: String
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  popularTag: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'ACTIVE'
  },
  hasEncryption: {
    type: Boolean,
    default: false
  },
  deliveryMethod: {
    type: String,
    default: 'USB_TOKEN_FIPS'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to keep redundant fields in sync
productSchema.pre('save', function (next) {
  if (this.price && !this.basePrice) this.basePrice = this.price;
  if (this.basePrice && !this.price) this.price = this.basePrice;
  if (this.description && !this.fullDescription) this.fullDescription = this.description;
  if (this.fullDescription && !this.description) this.description = this.fullDescription;
  if (this.isPopular !== undefined) this.popularTag = this.isPopular;
  if (this.popularTag !== undefined) this.isPopular = this.popularTag;
  if (this.isActive !== undefined) this.status = this.isActive ? 'ACTIVE' : 'INACTIVE';
  if (this.status !== undefined) this.isActive = this.status === 'ACTIVE';
  if (this.suitableFor && this.suitableFor.length && (!this.useCases || !this.useCases.length)) {
    this.useCases = this.suitableFor;
  }
  if (this.useCases && this.useCases.length && (!this.suitableFor || !this.suitableFor.length)) {
    this.suitableFor = this.useCases;
  }
  if (this.requiredDocuments && this.requiredDocuments.length && (!this.documentsRequired || !this.documentsRequired.length)) {
    this.documentsRequired = this.requiredDocuments;
  }
  if (this.documentsRequired && this.documentsRequired.length && (!this.requiredDocuments || !this.requiredDocuments.length)) {
    this.requiredDocuments = this.documentsRequired;
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);
