import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    name: yup.string()
        .trim()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
        phone: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .test("phone", "Enter valid Indian mobile number", (value) => {
            if (!value) return true;
            return /^[6-9]\d{9}$/.test(value);
        }),
    dob: yup.string(),
});

interface PersonalInfoFormProps {
    userData: {
        name?: string;
        phone?: string;
        dob?: string;
    };
    onSubmit: (formData: any) => void;
}
export function PersonalInfoForm({ userData, onSubmit }: PersonalInfoFormProps) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: userData?.name || '',
            phone: userData?.phone || '',
            dob: userData?.dob || '',
        }
    });
    const onSubmitForm = async (data: any) => {
        onSubmit(data);
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register("name")}
                                onBlur={(e) => e.target.value = e.target.value.trim()}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                            id="dob"
                            type="date"
                            {...register("dob")}
                        />
                        {errors.dob && (
                            <p className="text-sm text-destructive">{errors.dob.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">

                    <Button type="submit">Save Changes</Button>

                </CardFooter>
            </form>
        </Card>
    );
}
