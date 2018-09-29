export interface Scooter {
    speed?: number;
    avg_speed?: number;
    max_speed?: number;

    distance_travelled?: number;
    total_distance?: number;

    motor_temperature?: number;

    scooterLocked?: boolean;
    cruiseActive?: boolean;
    lightActive?: boolean;

    recovery_mode?: 0 | 1 | 2;
    cruise_mode?: boolean;
    light_mode?: boolean;
    lock_mode?: boolean;

    recovered_amp?: number;
    spent_amp?: number;

    remaining_capacity?: number;
    battery_life?: number;
    battery_temp1?: number;
    battery_temp2?: number;
    current_ampere?: number;
    current_voltage?: number;
    maxPower?: number;
}
