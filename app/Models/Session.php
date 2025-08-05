<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Session
 *
 * @property int $id
 * @property int $table_id
 * @property \Illuminate\Support\Carbon $start_time
 * @property \Illuminate\Support\Carbon|null $end_time
 * @property int $pax
 * @property string|null $customer_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Table $table
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Session newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Session newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Session query()
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereCustomerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session wherePax($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereTableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Session active()
 * @method static \Database\Factories\SessionFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Session extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'dining_sessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'table_id',
        'start_time',
        'end_time',
        'pax',
        'customer_name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'table_id' => 'integer',
        'pax' => 'integer',
    ];

    /**
     * Get the table for this session.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    /**
     * Scope a query to only include active sessions.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->whereNull('end_time');
    }
}