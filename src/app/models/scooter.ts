export interface Scooter {
    serial_number?: number;
    firmware_version?: number;
    bms_code?: number;

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

    recovered_amp?: number;
    spent_amp?: number;

    battery_life?: number;
    bettery_serial?: string;
    battery_design_capacity?: number;
    battery_remaining_capacity?: number;
    battery_health?: number;
    battery_temp1?: number;
    battery_temp2?: number;
    current_ampere?: number;
    current_voltage?: number;
    battery_charges?: number;
    battery_avg_charge?: number;
    voltage_cells?: number[];
}
