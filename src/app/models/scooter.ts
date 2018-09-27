export interface Scooter {
    speed: number;
    distance_travelled: number;
    current_speed: number;
    motor_temperature: number;

    scooterLocked: boolean;
    cruiseActive: boolean;
    lightActive: boolean;

    recoveryMode: 0 | 1 | 2;

    maxPower: number;
    minPower: number;

    recovered_amp: number;
    spent_amp: number;

    current_ampere: number;
    current_voltage: number;

    remaining_capacity: number;
    battery_life: number;
    battery_temp: number;
}