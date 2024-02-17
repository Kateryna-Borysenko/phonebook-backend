import { createContactSchema } from './contactSchemas.js';

const contactData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

const { error, value } = createContactSchema.validate(contactData);

if (error) {
  console.log('🛑 Validation Error:', error.details.map(detail => detail.message).join(', '));
} else {
  console.log('✅ Validation Passed:', value);
}