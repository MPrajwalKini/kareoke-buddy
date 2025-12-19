import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Search, Mic2, ArrowRight, Cast, Wifi, Link } from 'lucide-react-native';

export default function App() {
    const [hostIp, setHostIp] = useState('');
    const [connectedIp, setConnectedIp] = useState<string | null>(null);

    const [query, setQuery] = useState('');
    const [lastAction, setLastAction] = useState<string | null>(null);

    const handleConnect = () => {
        if (hostIp.length > 6) { // basic validation
            setConnectedIp(hostIp);
        }
    };

    const handleDisconnect = () => {
        setConnectedIp(null);
        setHostIp('');
    };

    const handleAdd = () => {
        if (!query) return;
        setLastAction(`Sent to ${connectedIp}: ${query}`);
        setQuery('');
        // In future: HTTP POST to http://${connectedIp}:3000/api/queue
    };

    // --- SCREEN 1: CONNECTION ---
    if (!connectedIp) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centerContent}>
                    <View style={styles.logoContainerLarge}>
                        <View style={styles.iconCircle}>
                            <Cast color="#000" size={40} />
                        </View>
                        <Text style={styles.titleLarge}>Connect to Host</Text>
                        <Text style={styles.subtitleLarge}>Enter the IP address provided by the TV</Text>
                    </View>

                    <View style={styles.connectForm}>
                        <View style={styles.inputWrapper}>
                            <Wifi size={20} color="#9ca3af" />
                            <TextInput
                                style={styles.input}
                                placeholder="192.168.1.X"
                                placeholderTextColor="#6b7280"
                                value={hostIp}
                                onChangeText={setHostIp}
                                keyboardType="numeric"
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.connectButton, !hostIp && styles.disabledButton]}
                            onPress={handleConnect}
                            disabled={!hostIp}
                        >
                            <Text style={styles.connectButtonText}>Connect</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // --- SCREEN 2: CONTROLLER ---
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Mic2 color="#a855f7" size={24} />
                    <Text style={styles.title}>Antigravity Remote</Text>
                </View>
                <TouchableOpacity onPress={handleDisconnect}>
                    <View style={styles.connectedBadge}>
                        <View style={styles.greenDot} />
                        <Text style={styles.connectedText}>{connectedIp}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.content}>

                {/* Search Box */}
                <View style={styles.searchContainer}>
                    <View style={styles.inputWrapper}>
                        <Search size={20} color="#9ca3af" />
                        <TextInput
                            style={styles.input}
                            placeholder="Youtube URL or Song Name..."
                            placeholderTextColor="#6b7280"
                            value={query}
                            onChangeText={setQuery}
                        />
                    </View>
                    <TouchableOpacity
                        style={[styles.addButton, !query && styles.disabledButton]}
                        onPress={handleAdd}
                        disabled={!query}
                    >
                        <Plus size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Status / History */}
                <View style={styles.statusCard}>
                    <Text style={styles.sectionTitle}>Last Action</Text>
                    {lastAction ? (
                        <View style={styles.actionItem}>
                            <ArrowRight size={16} color="#a855f7" />
                            <Text style={styles.actionText}>{lastAction}</Text>
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>Ready to command</Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
    },
    logoContainerLarge: {
        alignItems: 'center',
        marginBottom: 48,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#a855f7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    titleLarge: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitleLarge: {
        color: '#9ca3af',
        fontSize: 16,
        textAlign: 'center',
    },
    connectForm: {
        gap: 16,
    },
    connectButton: {
        height: 56,
        backgroundColor: '#a855f7',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    connectButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    header: {
        padding: 24,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    connectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f2937',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
    },
    connectedText: {
        color: '#9ca3af',
        fontSize: 12,
    },
    content: {
        padding: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#1f2937',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    addButton: {
        width: 56,
        height: 56,
        backgroundColor: '#a855f7',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#4b5563',
        opacity: 0.5,
    },
    statusCard: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    sectionTitle: {
        color: '#9ca3af',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
    },
    emptyText: {
        color: '#4b5563',
        fontStyle: 'italic',
    }
});
