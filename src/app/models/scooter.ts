export interface Scooter {
    serial_number?: string;
    firmware_version?: string;
    bms_code?: string;

    error_code?: number;
    warning_oce?: number;

    speed?: number;
    avg_speed?: number;
    max_speed?: number;

    distance_travelled?: number;
    distance_remaining?: number;
    total_distance?: number;
    uptime?: string;
    ridding_time?: number;

    motor_temperature?: number;

    recovery_mode?: 0 | 1 | 2;
    cruise_mode?: boolean;
    light_mode?: boolean;
    lock_mode?: boolean;

    battery_life?: number;
    battery_serial?: string;
    battery_date?: string;
    battery_design_capacity?: number;
    battery_remaining_capacity?: number;
    battery_health?: number;
    battery_temp1?: number;
    battery_temp2?: number;
    battery_ampere?: number;
    battery_voltage?: number;
    battery_power?: number;
    battery_max_power?: number;
    battery_min_power?: number;
    battery_charges?: number;
    battery_full_charges?: number;
    voltage_cells?: number[];
}
