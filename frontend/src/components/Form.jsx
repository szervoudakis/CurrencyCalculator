import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button.jsx";
import Message from "./Message.jsx";
import styles from "../styles/Form.module.css";

/**
 * Generic Form component using react-hook-form
 * @param {Array} fields - array of { name, label, type, placeholder, required }
 * @param {string} mode - 'add' | 'update'
 * @param {function} onSubmit - callback for submission
 */
export default function Form({ fields = [], mode = "add", onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h3>{mode === "add" ? "Add New" : "Update"} Item</h3>

      {fields.map((field) => (
        <div key={field.name} className={styles.fieldGroup}>
          {/* If field is dropdown */}
          {field.type === "select" ? (
            <select
              {...register(field.name, {
                required: field.required && `${field.label} is required`,
              })}
              className={`${styles.input} ${
                errors[field.name] ? styles.inputError : ""
              }`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              step={field.step || ""} 
              placeholder={field.placeholder || field.label}
              defaultValue={field.defaultValue || ""}
              disabled={field.disabled || false} 
              {...register(field.name, {
                required: field.required && `${field.label} is required`,
                minLength: field.minLength && {
                  value: field.minLength,
                  message: `${field.label} must be at least ${field.minLength} characters`,
                },
                validate: field.validate,
              })}
              className={`${styles.input} ${
                errors[field.name] ? styles.inputError : ""
              }`}
            />
          )}

          {errors[field.name] && (
            <p className={styles.error}>{errors[field.name].message}</p>
          )}
        </div>
      ))}

      <Button
        type="submit"
        label={mode === "add" ? "Add" : "Update"}
        variant={mode === "add" ? "success" : "primary"}
      />

      <Message
        type={Object.keys(errors).length ? "error" : ""}
        text={
          Object.keys(errors).length
            ? "Please fix the errors above before continuing."
            : ""
        }
      />
    </form>
  );
}
