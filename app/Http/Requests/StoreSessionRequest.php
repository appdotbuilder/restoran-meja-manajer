<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSessionRequest extends FormRequest
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
            'table_id' => 'required|exists:tables,id',
            'pax' => 'required|integer|min:1|max:20',
            'customer_name' => 'nullable|string|max:255',
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
            'table_id.required' => 'Table ID is required.',
            'table_id.exists' => 'Selected table does not exist.',
            'pax.required' => 'Number of people is required.',
            'pax.min' => 'At least 1 person is required.',
        ];
    }
}