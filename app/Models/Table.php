<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Table
 *
 * @property int $id
 * @property string $table_name
 * @property int $capacity
 * @property string $status
 * @property int $position_x
 * @property int $position_y
 * @property int|null $current_session_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Session|null $currentSession
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Reservation> $reservations
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Session> $sessions
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Table newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Table newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Table query()
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereCurrentSessionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table wherePositionX($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table wherePositionY($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereTableName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Table available()
 * @method static \Database\Factories\TableFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Table extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'table_name',
        'capacity',
        'status',
        'position_x',
        'position_y',
        'current_session_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'capacity' => 'integer',
        'position_x' => 'integer',
        'position_y' => 'integer',
        'current_session_id' => 'integer',
    ];

    /**
     * Get the current active session for this table.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function currentSession(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'current_session_id');
    }

    /**
     * Get all sessions for this table.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Get all reservations for this table.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'assigned_table_id');
    }

    /**
     * Scope a query to only include available tables.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}