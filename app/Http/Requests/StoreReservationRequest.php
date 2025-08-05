<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'pax' => 'required|integer|min:1|max:20',
            'reservation_time' => 'required|date|after:now',
            'assigned_table_id' => 'required|exists:tables,id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required.',
            'customer_phone.required' => 'Phone number is required.',
            'pax.required' => 'Number of people is required.',
            'pax.min' => 'At least 1 person is required.',
            'reservation_time.required' => 'Reservation time is required.',
            'reservation_time.after' => 'Reservation time must be in the future.',
            'assigned_table_id.required' => 'Please select a table.',
            'assigned_table_id.exists' => 'Selected table does not exist.',
        ];
    }
}