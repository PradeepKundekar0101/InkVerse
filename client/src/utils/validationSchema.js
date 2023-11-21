import * as yup from "yup";

export const userSchema = yup.object({
    user_name: yup.string().min(3,"user name must be at least 3 characters'").max(20,'User name must not exceed 20 characters').required("User Name required"),
    email: yup.string().email("Invalid Email").required("Email Required"),
    password:yup.string().min(6,"Password mmust be minimum 6 characters").max(20,'Password not exceed 20 characters').required("Password is required")
})



export const blogSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 40 characters'),

  content: yup.string().required('Content is required').min(10, 'Content must be at least 10 characters').max(1200,"Content must not exceed 360 characters"),

  tags: yup
    .array()
    .of(yup.string().min(2, 'Tag must be at least 2 characters').max(20, 'Tag must not exceed 20 characters'))
});


