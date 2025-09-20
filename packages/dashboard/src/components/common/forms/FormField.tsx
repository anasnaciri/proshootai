interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

const FormField = ({ label, children }: FormFieldProps) => (
  <div className="space-y-2">
    <label className="block text-gray-400 text-sm">{label}</label>
    {children}
  </div>
);

export default FormField;
